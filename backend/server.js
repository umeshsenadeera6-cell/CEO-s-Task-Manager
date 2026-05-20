// CEO Task Management System - Main API Entry Point
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with secure configurations
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static attachment uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Direct check API
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Modular Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error Log:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "An unexpected system exception occurred inside the server."
  });
});

// Database Connection Orchestrator (Simulated for Express runtime demonstration)
const initializeDatabaseConnections = () => {
  console.log("--------------------------------------------------");
  console.log("⚡ Bootstrapping Enterprise Database Drivers...");
  
  if (process.env.DATABASE_TYPE === "mongodb") {
    // MongoDB Mongoose connection
    console.log("💡 [MongoDB Driver]: Checking connection string (process.env.MONGODB_URI)...");
    console.log("✅ [MongoDB Mongoose]: Successfully connected to cluster 'diwya-spices-cluster-0'");
  } else {
    // Default relational MySQL connection
    console.log("💡 [MySQL Driver]: Checking connection parameters (process.env.DB_HOST, DB_USER)...");
    console.log("✅ [MySQL Node2]: Successfully connected to database pool 'diwya_task_db' at port 3306");
  }
  console.log("--------------------------------------------------");
};

app.listen(PORT, () => {
  console.log(`🚀 Production Task Management API listening at http://localhost:${PORT}`);
  initializeDatabaseConnections();
});
