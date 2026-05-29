import dotenv from "dotenv";
dotenv.config();


if (!process.env.MONGO_URI) {
    throw new Error("Please provide MONGO_URI in the .env file");

}
if (!process.env.JWT_SECRET) {
    throw new Error("Please provide JWT_SECRET in the .env file");

}
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the .env file");

}
if (!process.env.IMAGEKIT_PVT_KEY) {
    throw new Error("Please provide IMAGEKIT_PVT_KEY");

}
export const Config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    IMAGEKIT_PVT_KEY: process.env.IMAGEKIT_PVT_KEY,
}