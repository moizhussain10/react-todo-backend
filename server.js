import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));
// Schema & Model
const todoSchema = new mongoose.Schema({
  text: String,
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes

// Get all todos
app.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post("/todos", async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({ text });
  await todo.save();
  res.json(todo);
});

// Update (Edit) todo
app.put("/todos/:id", async (req, res) => {
  const { text } = req.body;

  // Agar text missing ho
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text },
    { new: true }
  );

  res.json(updatedTodo);
});


// Delete one todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Delete all todos
app.delete("/todos", async (req, res) => {
  await Todo.deleteMany({});
  res.json({ message: "All Deleted" });
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
