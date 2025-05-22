"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSearchTerm, setStatusFilter } from "../redux/taskSlice"
import { Moon, Sun, Search } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const Header = () => {
  const dispatch = useDispatch()
  const { searchTerm, statusFilter } = useSelector((state) => state.tasks)
  const { theme, toggleTheme } = useTheme()
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)

  const handleSearch = (e) => {
    setLocalSearchTerm(e.target.value)
    dispatch(setSearchTerm(e.target.value))
  }

  const handleFilterChange = (e) => {
    dispatch(setStatusFilter(e.target.value))
  }

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Manager</h1>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={localSearchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Tasks</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
