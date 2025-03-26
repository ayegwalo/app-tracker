import mongoose from "mongoose";
import {DB_URI, NODE_ENV} from "../config/env.js";

if (!DB_URI) {
    throw new Error("MongoDB is missing");
};

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);

        console.log(`connected to database ${NODE_ENV} mode`);

    } catch (error){
        console.error("Error in connecting to Database: ", error);
        process.exit(1);
    }
}

export default connectToDatabase;
