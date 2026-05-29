import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import databaseConnection from "./src/config/database.js";
databaseConnection();

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});