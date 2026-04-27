import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { connectDB } from "./src/db.ts";
import { runMigrations } from "./src/migrations.ts";
import { registerAdmin } from "./src/auth.ts";
import apiRoutes from "./src/routes.ts";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shouldWriteFileLogs = process.env.NODE_ENV === "production" || process.env.ENABLE_FILE_LOGS === "true";

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '5001');
 // Hardcoded as per infrastructure constraints

  console.log("🎬 Starting server initialization...");

  // Middleware
  app.use(cors());
  app.options('*all', cors()); // Enable pre-flight for all routes
  app.use(express.json());

  // Request logger for debugging
  app.use((req, res, next) => {
    const start = Date.now();
    const logMsg = (m: string) => {
        if (shouldWriteFileLogs) {
          try { fs.appendFileSync(path.join(__dirname, 'server_logs.txt'), `${new Date().toISOString()} - ${m}\n`); } catch (e) {}
        }
        console.log(m);
    };
    
    // Simple test route that bypasses everything
    if (req.url === '/test-reachability') {
        return res.send('OK - Server is reachable');
    }

    logMsg(`>>> INCOMING: ${req.method} ${req.url}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        logMsg(`<<< FINISHED: ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // Initialize DB and Migrations
  try {
    const log = (msg: string) => {
        const text = `${new Date().toISOString()} - [SERVER] ${msg}\n`;
        if (shouldWriteFileLogs) {
          try { fs.appendFileSync(path.join(__dirname, 'server_logs.txt'), text); } catch (e) {}
        }
        console.log(msg);
    };

    log("🔄 Initializing database connection...");
    await connectDB();
    
    log("🔄 Running migrations...");
    await runMigrations();

    // Create default admin if configured
    log("🔄 Ensuring admin user exists...");
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASS) {
      await registerAdmin(process.env.ADMIN_EMAIL, process.env.ADMIN_PASS);
    } else {
      // Default fallback admin for testing
      await registerAdmin('admin@capbon2028.tn', 'admin123');
    }
    log("✅ Server initialization sequence complete");
  } catch (dbError) {
    console.error("❌ Database initialization failed:", dbError);
  }

  // Ensure uploads directory exists
  const uploadPath = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  app.use("/uploads", express.static(uploadPath));

  // --- API Routes ---
  app.use("/api", apiRoutes);
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- Vite Middleware or Production Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Dev SPA Fallback for Admin
    // If request starts with /admin and doesn't look like a file, rewrite to admin index
    app.use((req, res, next) => {
      if (req.url.startsWith('/admin') && !req.url.includes('.')) {
        req.url = '/admin/index.html';
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, "dist");
    
    // 1. Serve all static assets from dist
    app.use(express.static(distPath));
    
    // 2. Handle admin SPA fallback (order matters: after static)
    // For Express 5, *all is the recommended catch-all pattern
    const serveAdmin = (req, res) => {
      res.sendFile(path.join(distPath, "admin", "index.html"));
    };
    app.get("/admin", serveAdmin);
    app.get("/admin/*all", serveAdmin);
    
    // 3. Handle main SPA fallback
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}`);
    console.log(`   Frontend: http://localhost:${PORT}`);
    console.log(`   Admin:    http://localhost:${PORT}/admin`);
    console.log(`   API Base: http://localhost:${PORT}/api\n`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
