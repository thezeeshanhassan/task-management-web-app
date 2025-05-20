const express = require("express")
const router = express.Router()
const Task = require("../models/Task")

//// Get - All Tasks
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//// POST- Create a new task

router.post("/", async (req, res) => {
    try {
        // Validate request
        if (!req.body.title || req.body.title.trim() === "") {
            return res.status(400).json({ message: "Title is required" })
        }

        if (req.body.title.length > 100) {
            return res.status(400).json({ message: "Title must be less than 100 characters" })
        }

        if (req.body.description && req.body.description.length > 500) {
            return res.status(400).json({ message: "Description must be less than 500 characters" })
        }

        // Check for duplicate titles within the same status
        const duplicateTask = await Task.findOne({
            title: req.body.title,
            status: req.body.status,
        })

        if (duplicateTask) {
            return res.status(400).json({
                message: "A task with this title already exists in this status group",
            })
        }

        const task = new Task({
            title: req.body.title,
            description: req.body.description || "",
            deadline: req.body.deadline,
            status: req.body.status,
            updatedAt: new Date(),
        })

        const newTask = await task.save()
        res.status(201).json(newTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//// Get - A specific task
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.json(task)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//// PUT- Update a task

router.put("/:id", async (req, res) => {
    try {
        if (req.body.title && req.body.title.length > 100) {
            return res.status(400).json({ message: "Title must be less than 100 characters" })
        }

        if (req.body.description && req.body.description.length > 500) {
            return res.status(400).json({ message: "Description must be less than 500 characters" })
        }

        // Check for duplicate titles within the same status (excluding current task)
        if (req.body.title && req.body.status) {
            const duplicateTask = await Task.findOne({
                _id: { $ne: req.params.id },
                title: req.body.title,
                status: req.body.status,
            })

            if (duplicateTask) {
                return res.status(400).json({
                    message: "A task with this title already exists in this status group",
                })
            }
        }

        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedAt: new Date()
            }, { new: true }
        )
        if (!updateTask) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.json(updateTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Patch - Update task status

router.patch("/:id/status", async (req, res) => {
    try {
        if (!req.body.status) {
            return res.status(400).json({ message: "Status is required" })
        }

        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        // Check for duplicate titles within the new status
        const duplicateTask = await Task.findOne({
            _id: { $ne: req.params.id },
            title: task.title,
            status: req.body.status,
        })

        if (duplicateTask) {
            return res.status(400).json({
                message: "A task with this title already exists in the target status group",
            })
        }

        task.status = req.body.status
        task.updatedAt = new Date()

        const updatedTask = await task.save()
        res.json(updatedTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//// Delete - A task

router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({
            _id: req.params.id,
        })
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.json({ message: "Task deleted" })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router;