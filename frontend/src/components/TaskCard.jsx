"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { updateTask } from "../redux/taskSlice"
import { Clock, AlertTriangle } from "lucide-react"
import ConfirmationModal from "./ConfirmationModal"

const TaskCard = ({ task, onEdit }) => {
  const dispatch = useDispatch()
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Check if task is overdue
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "Done"

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleStatusChange = (newStatus) => {
    dispatch(
      updateTask({
        ...task,
        status: newStatus,
      }),
    )
    setShowStatusDropdown(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
        <div className="relative">
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`text-xs px-2 py-1 rounded-full ${
              task.status === "To Do"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                : task.status === "In Progress"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
            }`}
          >
            {task.status}
          </button>

          {showStatusDropdown && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-600">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                  onClick={() => handleStatusChange("To Do")}
                >
                  To Do
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                  onClick={() => handleStatusChange("In Progress")}
                >
                  In Progress
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-gray-700 dark:text-gray-200"
                  onClick={() => handleStatusChange("Done")}
                >
                  Done
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{task.description}</p>

      {task.deadline && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
          <Clock className="h-3 w-3 mr-1" />
          <span>Due: {formatDate(task.deadline)}</span>

          {isOverdue && (
            <span className="ml-2 flex items-center text-red-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Overdue
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={onEdit}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Edit
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          Delete
        </button>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          dispatch(updateTask({ ...task, _delete: true }))
          setShowDeleteModal(false)
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </div>
  )
}

export default TaskCard
