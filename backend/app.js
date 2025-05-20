const express = require("express");
// const cors = require("cors");
const mongoose = require("mongoose")

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welocme to Task Management App");
})

mongoose.connect("mongodb://localhost:27017/task-management").then(() => { console.log("Connected to MongoDB") }).catch((err) => { "Error while connecting to MongoDB" })

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})