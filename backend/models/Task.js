const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    deadline: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Add validation for duplicate titles within the same status
taskSchema.index({ title: 1, status: 1 }, { unique: true })

module.exports = mongoose.model("Task", taskSchema)
