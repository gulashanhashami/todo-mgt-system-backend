import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    task: { type: String, required: true },
    status: { type: String, enum: ["in_progress", "completed", "overdue"], default: "in_progress" },
},
    {
        versionKey: false,
        timestamps: true,
    });

export default mongoose.model("Todo", todoSchema);