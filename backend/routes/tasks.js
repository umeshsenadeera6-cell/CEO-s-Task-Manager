// Tasks API Routing & Controller Modules
const express = require("express");
const multer = require("multer");
const path = require("path");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// File upload setup using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * @route   GET /api/tasks
 * @desc    Fetch task records matching filter criteria
 */
router.get("/", verifyToken, (req, res) => {
  const { location, department, assignedTo, status } = req.query;

  // In production, execute query:
  // let filter = {};
  // if (location) filter.location = location;
  // if (department) filter.department = department;
  // if (assignedTo) filter.assignedTo = assignedTo;
  // if (status) filter.status = status;
  // const tasks = await Task.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    message: "Tasks list queried successfully.",
    filtersApplied: { location, department, assignedTo, status },
    tasks: [] // Production database query output returns here
  });
});

/**
 * @route   POST /api/tasks
 * @desc    CEO or Manager assigns a new directive
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles(["CEO", "Manager"]),
  upload.array("attachments"),
  (req, res) => {
    const { title, description, priority, deadline, assignedTo, department, location } = req.body;

    if (!title || !description || !assignedTo || !deadline) {
      return res.status(400).json({ error: "Missing required directive parameters." });
    }

    const attachments = req.files ? req.files.map((file) => ({
      name: file.originalname,
      size: `${Math.round(file.size / 1024)} KB`,
      path: file.path,
      type: path.extname(file.originalname).substring(1)
    })) : [];

    // In production:
    // const newTask = new Task({ ...fields, attachments, assignedBy: req.user.name });
    // await newTask.save();

    res.status(201).json({
      success: true,
      message: "Directive assigned successfully.",
      task: {
        title,
        priority,
        status: "Pending",
        assignedTo,
        attachments,
        assignedBy: req.user.name,
        history: [{ action: "Directive initialized", user: req.user.name, timestamp: new Date() }]
      }
    });
  }
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Modify directive details (CEO/Manager) or update progress status (Assignee)
 */
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body;

  // In production, locate the target task:
  // const task = await Task.findById(id);
  // If user is Staff and not assigned to this task, restrict status update:
  // if (req.user.role === 'Staff' && task.assignedTo !== req.user.username) { return 403 }

  // Compile audit timeline:
  // task.history.push({ action: 'Status changed', user: req.user.name });
  // await task.save();

  res.status(200).json({
    success: true,
    message: `Directive ${id} updated successfully.`,
    updatedFields: fieldsToUpdate
  });
});

/**
 * @route   POST /api/tasks/:id/comments
 * @desc    Add feedback or progress comment to a directive
 */
router.post("/:id/comments", verifyToken, (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Comment text body is missing." });
  }

  // In production:
  // const task = await Task.findById(id);
  // task.comments.push({ user: req.user.name, role: req.user.role, content, timestamp: new Date() });
  // await task.save();

  res.status(201).json({
    success: true,
    message: "Comment appended to directive timeline.",
    comment: {
      id: "c-" + Date.now(),
      user: req.user.name,
      role: req.user.role,
      content,
      timestamp: new Date()
    }
  });
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Remove assigned directive (CEO/Manager only)
 */
router.delete("/:id", verifyToken, authorizeRoles(["CEO", "Manager"]), (req, res) => {
  const { id } = req.params;

  // In production:
  // await Task.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: `Directive ${id} deleted successfully.`
  });
});

module.exports = router;
