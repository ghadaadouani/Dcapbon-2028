# Cap Bon 2028 - Full Stack Gastronomy Platform

This project features a bilingual (English/French) candidacy platform for Cap Bon's World Region of Gastronomy 2028 bid. It includes a public frontend, a secure admin dashboard, and a robust Node.js/MySQL backend.

## 🚀 Features

- **Public Site**: Bilingual tourism and gastronomy exploration.
- **Admin Dashboard**: Full content management (Pages, Menu, Blog, Events, Media).
- **Backend API**: Secure Node.js/Express REST API with JWT authentication.
- **Database**: Scaleable MySQL schema (falls back to SQLite for easy local previews).
- **Dockerized**: One-command deployment for the entire stack.

## 🛠️ Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js v20+](https://nodejs.org/)

## 🏃 Local Development (Docker)

To start the entire platform locally using Docker:

1.  Clone the repository.
2.  Create a `.env` file from `.env.example`.
3.  Run the following command:
    ```bash
    docker-compose up --build
    ```

Once the containers are running:
- **Frontend (Public)**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) (accessible via build proxy)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

## 🔑 Initial Admin Setup

The system automatically creates a default administrator if no users exist.
- **Email**: `admin@capbon2028.tn`
- **Password**: `Admin123!`

You should change this password immediately in the Admin settings upon first login.

## 📦 Project Structure

- `/src`: Public frontend React application.
- `/admin`: React admin dashboard application.
- `/backend`: Node.js/Express backend logic and migrations.
- `server.ts`: Full-stack entry point integrating Vite and API.

## 💾 Database Backup

To back up the MySQL database from the running Docker container:
```bash
docker exec capbon_db /usr/bin/mysqldump -u capbon_admin --password=capbon_password capbon_db > backup.sql
```

## 🔐 Security Note

Always ensure `.env` is excluded from version control. In production, change the `JWT_SECRET` and database passwords to cryptographically strong values.
