const express = require("express")
const router = express.Router()
const taskController = require("../controllers/taskControllers")

// GET all tasks
router.get("/", taskController.getAllTasks)

// GET a single task
router.get("/:id", taskController.getTaskById)

// POST a new task
router.post("/", taskController.createTask)

// PUT update a task
router.put("/:id", taskController.updateTask)

// DELETE a task
router.delete("/:id", taskController.deleteTask)

module.exports = router
