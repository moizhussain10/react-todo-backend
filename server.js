import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
  }
}


connectDB();


const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});
const Todo = mongoose.model("Todo", todoSchema);


app.get("/", (req, res) => {
  res.send("🚀 Backend running successfully!");
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  const todo = new Todo({ text });
  await todo.save();
  res.json(todo);
});

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

app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.delete("/todos", async (req, res) => {
  await Todo.deleteMany({});
  res.json({ message: "All Deleted" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
