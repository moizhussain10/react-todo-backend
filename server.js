import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (Correct way for Node 20+)
async function connectDB() {
  try {
    await mongoose.connect("mongodb+srv://moizh6000:uEHLjLl8NVOolqoJ@mycuster.fngnpae.mongodb.net/myDatabase?appName=MyCuster");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
}

connectDB();

// ✅ Schema & Model
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});
const Todo = mongoose.model("Todo", todoSchema);

// ✅ Default route (Railway test)
app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

// ✅ Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// ✅ Add new todo
app.post("/todos", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  const todo = new Todo({ text });
  await todo.save();
  res.json(todo);
});

// ✅ Update todo
app.put("/todos/:id", async (req, res) => {
  const { text } = req.body;

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

// ✅ Delete one todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ✅ Delete all todos
app.delete("/todos", async (req, res) => {
  await Todo.deleteMany({});
  res.json({ message: "All Deleted" });
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
