// MongoDB & Mongoose Schema Definitions
// CEO Task Management System

const mongoose = require("mongoose");
const { Schema } = mongoose;

// 1. User Schema Definition
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["CEO", "Manager", "Staff"],
      default: "Staff",
      required: true
    },
    position: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: null
    },
    location: {
      type: String,
      required: true,
      index: true // Indexing locations for fast queries
    },
    department: {
      type: String,
      required: true,
      index: true // Indexing departments for fast queries
    }
  },
  {
    timestamps: true
  }
);

// 2. Embedded Sub-document Schemas
const CommentSchema = new Schema({
  user: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AttachmentSchema = new Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  path: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const HistorySchema = new Schema({
  action: { type: String, required: true },
  user: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// 3. Task Schema Definition (Aggregated Document Structure)
const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
      required: true,
      index: true
    },
    deadline: {
      type: String, // YYYY-MM-DD format
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Under Review", "Completed"],
      default: "Pending",
      required: true,
      index: true
    },
    assignedTo: {
      type: String, // References User.username
      required: true,
      index: true
    },
    assignedBy: {
      type: String, // CEO or Manager Name
      required: true
    },
    location: {
      type: String,
      required: true,
      index: true
    },
    department: {
      type: String,
      required: true,
      index: true
    },
    attachments: [AttachmentSchema], // Nested Array of attachments
    comments: [CommentSchema],       // Nested Array of comments
    history: [HistorySchema]         // Nested Array of changes history
  },
  {
    timestamps: true
  }
);

// Export Models
module.exports = {
  User: mongoose.model("User", UserSchema),
  Task: mongoose.model("Task", TaskSchema)
};
