import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//function for connecting database
const connect_db = () => {
    return mongoose.connect(process.env.MONGO_DATABASE);
}

export default connect_db;