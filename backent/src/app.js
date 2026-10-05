const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary task data
// Later this will come from MySQL
let tasks = [
  {
    id: 1,
    title: "Learn Docker",
    details: "Build and run a Docker container",
    completed: false,
  },
  {
    id: 2,
    title: "Learn AWS ECS",
    details: "Practice deploying containers on ECS",
    completed: false,
  },
];

// ==========================
// GET - All Tasks
// ==========================

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// ==========================
// GET - Single Task
// ==========================

app.get("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

// ==========================
// POST - Create Task
// ==========================

app.post("/api/tasks", (req, res) => {
  const { title, details } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  const newTask = {
    id: Date.now(),
    title: title,
    details: details || "",
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// ==========================
// PUT - Update Task
// ==========================

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, details, completed } = req.body;

  if (title !== undefined) {
    task.title = title;
  }

  if (details !== undefined) {
    task.details = details;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json(task);
});

// ==========================
// DELETE - Delete Task
// ==========================

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task deleted successfully",
  });
});

// ==========================
// Health Check
// ==========================

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "TaskFlow API",
  });
});

// Start server

app.listen(PORT, () => {
  console.log(`TaskFlow API running on port ${PORT}`);
});
