# Diwya Spices Task Manager - Backend Server API Setup Guide

This directory holds the complete, enterprise-ready REST API backend for the **CEO Task Management System**. It is built using **Node.js** + **Express** and supports dual database drivers for either **MySQL** or **MongoDB**.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Project Directory Architecture](#-project-directory-architecture)
3. [Environment Configuration (`.env`)](#-environment-configuration-env)
4. [Database Provisioning & Schema Initialization](#-database-provisioning--schema-initialization)
   - [Option A: Relational MySQL Setup](#option-a-relational-mysql-setup)
   - [Option B: Document MongoDB Setup](#option-b-document-mongodb-setup)
5. [Installation & Initialization](#-installation--initialization)
6. [API Endpoints Directory](#-api-endpoints-directory)
7. [Production Deployment Recommendations](#-production-deployment-recommendations)

---

## 🛠 Prerequisites

Ensure the following tools are installed locally:
- **Node.js** (v18.0.0 or higher recommended)
- **NPM** (v9.0.0+) or **Yarn**
- **MySQL Server** (v8.0+) OR a **MongoDB Cluster** (Atlas cloud cluster or local community instance)

---

## 📂 Project Directory Architecture

```text
backend/
├── db/
│   ├── schema.sql           # MySQL Table structures DDL script
│   └── schema.mongodb.js    # Mongoose Object-Document schemas
├── middleware/
│   └── auth.js              # Express JWT validation & role authorization
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── tasks.js             # Task CRUD and commentary logs
│   └── users.js             # Employee rosters and workload compiles
├── uploads/                 # Static attachments storage folder
├── .env.example             # Template for local environment parameters
├── package.json             # Core dependency settings
└── server.js                # System bootstrapper and entry point
```

---

## ⚙️ Environment Configuration (`.env`)

In the `backend/` root, duplicate the `.env.example` file (or create `.env`) and supply parameters:

```env
# Server settings
PORT=5000
NODE_ENV=production
CLIENT_URL=http://localhost:5173

# JWT Encryption Key
JWT_SECRET=your_complex_jwt_secret_signature_key_2026

# Database Settings (Choose 'mysql' or 'mongodb')
DATABASE_TYPE=mysql

# MySQL Settings
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_secure_password
DB_NAME=diwya_task_db

# MongoDB Settings (Ignore if using MySQL)
MONGODB_URI=mongodb+srv://admin:pass@cluster0.example.mongodb.net/diwya_db
```

---

## 🗄 Database Provisioning & Schema Initialization

### Option A: Relational MySQL Setup

1. Open your terminal or MySQL Workbench, log in as root/admin.
2. Run the DDL script situated in [db/schema.sql](file:///Users/erangasenadeera/Developing Projects/CEO Task Manager/backend/db/schema.sql):
   ```bash
   mysql -u root -p < db/schema.sql
   ```
3. This creates the database `diwya_task_db` and initializes the following tables:
   - `users` (Handles credentials, positions, workspaces)
   - `tasks` (Stores directives, deadliness, priorities)
   - `comments` (Direct feedback and updates)
   - `attachments` (File sizing, extensions, static paths)
   - `task_history` (Audit modification nodes)

### Option B: Document MongoDB Setup

1. Change `DATABASE_TYPE=mongodb` in `.env`.
2. Supply a valid MongoDB URI.
3. The server entry file [server.js](file:///Users/erangasenadeera/Developing Projects/CEO Task Manager/backend/server.js) automatically registers the Mongoose models defined in [db/schema.mongodb.js](file:///Users/erangasenadeera/Developing Projects/CEO Task Manager/backend/db/schema.mongodb.js) and maps queries accordingly.

---

## 🚀 Installation & Initialization

1. Open a terminal inside the `/backend` folder.
2. Run the NPM command to install all configurations:
   ```bash
   npm install
   ```
3. Start the dev server with hot reload:
   ```bash
   npm run dev
   ```
4. Start the production server directly:
   ```bash
   npm start
   ```

The terminal should output:
```text
🚀 Production Task Management API listening at http://localhost:5000
--------------------------------------------------
⚡ Bootstrapping Enterprise Database Drivers...
✅ [MySQL Node2]: Successfully connected to database pool 'diwya_task_db' at port 3306
--------------------------------------------------
```

---

## 📡 API Endpoints Directory

| Method | Endpoint | Access Rule | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public | Digital credential authentication, returns JWT |
| **GET** | `/api/auth/me` | Logged In | Audits active session token payload |
| **GET** | `/api/tasks` | Logged In | Queries tasks with location/status parameters |
| **POST** | `/api/tasks` | CEO/Manager | Assigns a brand new directive with optional attachments |
| **PUT** | `/api/tasks/:id` | Logged In | Updates status/priority details of a directive |
| **POST** | `/api/tasks/:id/comments`| Logged In | Appends commentary feedback to a directive |
| **DELETE**| `/api/tasks/:id` | CEO/Manager | Deletes an active task directive |
| **GET** | `/api/users` | Logged In | Retrieves site/department employee roster |
| **GET** | `/api/users/performance` | Logged In | Generates completion ratio index |

---

## 🔒 Production Deployment Recommendations

1. **Password Encryption**: Always use standard crypts. The login route supports standard `bcryptjs` hashing. Always hash employee passwords before storing.
2. **CORS Headers**: Set `CLIENT_URL` explicitly to your production frontend address (e.g. `https://taskmanager.diwyaspices.com`). Avoid setting `*` wildcard origins.
3. **Uploads Safety**: Set up secure storage bounds (e.g., AWS S3 bucket) in production instead of local disk storage.
4. **SSL Certificates**: Always proxy connections through HTTPS to shield JWT tokens in transit.
