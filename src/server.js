import express from "express";
import cors from "cors";
import connect_db from "./configs/db.js";
import dotenv from "dotenv";
import authRoutes from "./controllers/userAuth.controller.js";
import userRoutes from "./controllers/users.controller.js";
import todoRoutes from "./controllers/todo.controller.js";

dotenv.config();

const app = express();
app.use(express.json());

const corsOPtions = {
    origin: "*",
    credential: true,
    optionSuccessStatus: 200
};

app.use(cors(corsOPtions));
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/todos", todoRoutes);

const port = process.env.PORT;

app.listen(port, async () => {
    try {
        await connect_db();
        console.log(`Listening on port: ${port}`)
    } catch (err) {
        console.log("Error: ", err.message);
    }
})
