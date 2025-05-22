"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTasks } from "../redux/taskSlice"
import TaskColumn from "./TaskColumn"
import TaskForm from "./TaskForm"
import { useState } from "react"
import { PlusCircle } from "lucide-react"

const TaskBoard = () => {
  const dispatch = useDispatch()
  const { tasks, status, error, searchTerm, statusFilter } = useSelector((state) => state.tasks)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks())
    }
  }, [status, dispatch])

  const openTaskForm = (task = null) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const closeTaskForm = () => {
    setEditingTask(null)
    setIsFormOpen(false)
  }

  // Filter tasks based on search term and status filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "All" || task.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Group tasks by status
  const todoTasks = filteredTasks
    .filter((task) => task.status === "To Do")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const inProgressTasks = filteredTasks
    .filter((task) => task.status === "In Progress")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const doneTasks = filteredTasks
    .filter((task) => task.status === "Done")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  if (status === "loading" && tasks.length === 0) {
    return <div className="flex justify-center p-8">Loading tasks...</div>
  }

  if (status === "failed") {
    return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Tasks</h2>
        <button
          onClick={() => openTaskForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn
          title="To Do"
          tasks={todoTasks}
          onEditTask={openTaskForm}
          color="bg-yellow-100 dark:bg-yellow-900/30"
          borderColor="border-yellow-400"
        />
        <TaskColumn
          title="In Progress"
          tasks={inProgressTasks}
          onEditTask={openTaskForm}
          color="bg-blue-100 dark:bg-blue-900/30"
          borderColor="border-blue-400"
        />
        <TaskColumn
          title="Done"
          tasks={doneTasks}
          onEditTask={openTaskForm}
          color="bg-green-100 dark:bg-green-900/30"
          borderColor="border-green-400"
        />
      </div>

      {isFormOpen && <TaskForm task={editingTask} onClose={closeTaskForm} isOpen={isFormOpen} />}
    </div>
  )
}

export default TaskBoard
