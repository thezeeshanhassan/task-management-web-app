import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = "http://localhost:3000/api/tasks"

// Async thunks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch tasks")
  }
})

export const addTask = createAsyncThunk("tasks/addTask", async (task, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, task)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add task")
  }
})

export const updateTask = createAsyncThunk("tasks/updateTask", async (task, { rejectWithValue }) => {
  try {
    // Check if this is a delete operation
    if (task._delete) {
      await axios.delete(`${API_URL}/${task._id}`)
      return { ...task, deleted: true }
    }

    const response = await axios.put(`${API_URL}/${task._id}`, task)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to update task")
  }
})

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    searchTerm: "",
    statusFilter: "All",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Add task
      .addCase(addTask.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.tasks.push(action.payload)
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded"

        // Handle delete operation
        if (action.payload.deleted) {
          state.tasks = state.tasks.filter((task) => task._id !== action.payload._id)
        } else {
          // Handle update operation
          const index = state.tasks.findIndex((task) => task._id === action.payload._id)
          if (index !== -1) {
            state.tasks[index] = action.payload
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export const { setSearchTerm, setStatusFilter } = taskSlice.actions

export default taskSlice.reducer
