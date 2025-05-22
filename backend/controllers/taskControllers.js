const Task = require("../models/Task")

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ updatedAt: -1 })
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new task
exports.createTask = async (req, res) => {
  try {
    // Check for duplicate title in the same status
    const existingTask = await Task.findOne({
      title: req.body.title,
      status: req.body.status,
    })

    if (existingTask) {
      return res.status(400).json({
        message: "A task with this title already exists in this status group",
      })
    }

    const task = new Task(req.body)
    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update a task
exports.updateTask = async (req, res) => {
  try {
    // Check for duplicate title in the same status (excluding the current task)
    if (req.body.title) {
      const existingTask = await Task.findOne({
        _id: { $ne: req.params.id },
        title: req.body.title,
        status: req.body.status,
      })

      if (existingTask) {
        return res.status(400).json({
          message: "A task with this title already exists in this status group",
        })
      }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(200).json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.status(200).json({ message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
