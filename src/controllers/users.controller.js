import express from "express";
import User from "../models/user.model.js";
import { auth, authorize } from "../middleware/auth.js";
const router = express.Router();

//Admin & Manager see all users, Normal user sees only self
router.get("/list", auth, async (req, res) => {
    try {
        if (req.user.role === "admin" || req.user.role === "manager") {
            const users = await User.find().select("-password"); // hide password
            return res.json(users);
        } else {
            const me = await User.findById(req.user.id).select("-password");
            return res.json([me]);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create or Add user (Admin + Manager)
router.post("/create", auth, authorize(["admin", "manager"]), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit user (Admin + Manager)
router.put("/update/:id", auth, authorize(["admin", "manager"]), async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Only Admin can delete user
router.delete("/delete/:id", auth, authorize(["admin"]), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;