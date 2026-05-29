import express from "express";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import orderRouter from "./routes/order.routes.js";
import addressRouter from "./routes/address.routes.js";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Config } from "./config/config.js";


import path from "path"

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(passport.initialize());

app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

// Serve static
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);

// SPA fallback — must be AFTER all API routes
app.get("/*name", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));


export default app;