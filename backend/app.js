const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const taskRoutes = require("./routes/taskRoutes")

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
    res.send("Welocme to Task Management App");
})

mongoose.connect("mongodb://localhost:27017/task-management").then(() => { console.log("Connected to MongoDB") }).catch((err) => { "Error while connecting to MongoDB" })

// Routes
app.use("/api/tasks", taskRoutes)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})