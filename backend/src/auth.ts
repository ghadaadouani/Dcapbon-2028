import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from './db.ts';
import fs from 'fs';

const logPath = './server_logs.txt';
const log = (msg: string) => {
    const text = `${new Date().toISOString()} - [AUTH] ${msg}\n`;
    try {
        fs.appendFileSync(logPath, text);
    } catch (e) {}
    console.log(text);
};

// Add a dummy comment to force file update sync
// Correcting ESM type imports for Express

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '8h';

export interface AuthRequest extends any {
    user?: any;
}

export const generateToken = (user: any) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

export const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export const registerAdmin = async (email: string, password: string) => {
    const hash = await bcrypt.hash(password, 10);
    try {
        await query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, hash, 'admin']);
        console.log(`✅ Admin user ${email} created`);
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY' || error.message.includes('UNIQUE')) {
            console.log(`ℹ️ Admin user ${email} already exists`);
        } else {
            throw error;
        }
    }
};

export const login = async (req: any, res: any) => {
    log(`Login process STAGE 1: Request received`);
    try {
        const { email, password } = req.body;
        log(`Login process STAGE 2: Data extracted for ${email}`);
        
        if (!email || !password) {
            log(`Login process STAGE 2.1: Missing fields`);
            return res.status(400).json({ error: 'Email and password required' });
        }

        log(`Login process STAGE 3: DB Query starting for ${email}`);
        const users: any = await query('SELECT * FROM users WHERE email = ?', [email]);
        log(`Login process STAGE 4: DB Query finished. Found: ${Array.isArray(users) ? users.length : (users ? 1 : 0)}`);
        
        const user = Array.isArray(users) ? users[0] : users;

        if (!user) {
            log(`Login process STAGE 4.1: User not found`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        log(`Login process STAGE 5: Bcrypt compare starting`);
        const isMatch = await bcrypt.compare(password, user.password_hash);
        log(`Login process STAGE 6: Bcrypt compare finished. Match: ${isMatch}`);
        
        if (!isMatch) {
            log(`Login process STAGE 6.1: Password mismatch`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        log(`Login process STAGE 7: Success. Generating token`);
        const token = generateToken(user);
        log(`Login process STAGE 8: Sending response`);
        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error: any) {
        log(`Login process ERROR: ${error.message}`);
        res.status(500).json({ error: 'Internal server error during login' });
    }
};
