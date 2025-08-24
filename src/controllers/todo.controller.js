import express from "express";
import Todo from "../models/todo.model.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

// create new task ( for all roles)
router.post("/create", auth, async (req, res) => {
    try {
        const todo = new Todo({
            userId: req.user.id,
            task: req.body.task,
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get list of task
// Admin can view all tasks
// Others can view only their own tasks
router.get("/list", auth, async (req, res) => {
    try {
        let todos;
        if (req.user.role === "admin") {
            todos = await Todo.find().populate("userId", "name email role");
        } else {
            todos = await Todo.find({ userId: req.user.id });
        }
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// can delete the task by id
// Users can delete only their own task
// Admin can delete any task from the list
router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Task not found" });

        // check ownership
        if (req.user.role !== "admin" && todo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed to delete this task" });
        }

        await todo.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;