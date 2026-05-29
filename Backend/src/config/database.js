import mongoose from "mongoose";
import { Config } from "./config.js";


const databaseConnection = async () => {
    try {
        const connection = await mongoose.connect(Config.MONGO_URI);
        console.log(`Database connected:`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);

    }
}

export default databaseConnection;