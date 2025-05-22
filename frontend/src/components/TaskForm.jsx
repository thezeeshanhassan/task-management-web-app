"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTask, updateTask } from "../redux/taskSlice"
import { X } from "lucide-react"

const TaskForm = ({ task, onClose, isOpen }) => {
  const dispatch = useDispatch()
  const tasks = useSelector((state) => state.tasks.tasks)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    deadline: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "",
      })
    }
  }, [task])

  const validateForm = () => {
    const newErrors = {}

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters"
    }

    // Check for duplicate titles in the same status group
    if (formData.title.trim()) {
      const duplicateTask = tasks.find(
        (t) =>
          t.title.toLowerCase() === formData.title.toLowerCase() &&
          t.status === formData.status &&
          (!task || t._id !== task._id),
      )

      if (duplicateTask) {
        newErrors.title = "A task with this title already exists in this status group"
      }
    }

    // Description validation
    if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      const taskData = {
        ...formData,
        deadline: formData.deadline || null,
      }

      if (task) {
        dispatch(updateTask(taskData))
          .unwrap()
          .then(() => {
            onClose()
          })
          .catch((error) => {
            setErrors({ submit: error.message || "Failed to update task" })
          })
          .finally(() => {
            setIsSubmitting(false)
          })
      } else {
        dispatch(addTask(taskData))
          .unwrap()
          .then(() => {
            onClose()
          })
          .catch((error) => {
            setErrors({ submit: error.message || "Failed to create task" })
          })
          .finally(() => {
            setIsSubmitting(false)
          })
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task ? "Edit Task" : "Create New Task"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength={100}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formData.title.length}/100 characters</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                maxLength={500}
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline (Optional)
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
