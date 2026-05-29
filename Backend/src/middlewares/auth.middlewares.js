import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";
import { Config } from "../config/config.js";
import logoutModel from "../models/logout.models.js";
export const authSellerMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ status: "Error", message: "Unauthorized" });
        }
        const logout = await logoutModel.findOne({ token })
        if (logout) {
            return res.status(401).json({ status: "Error", message: "Already Logged out" })
        }
        const decodedToken = jwt.verify(token, Config.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ status: "Error", message: "Unauthorized" });
        }
        if (user.role != "seller") {
            return res.status(403).json({ status: "Error", message: "Forbidden" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in user authentication:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {

        const logout = await logoutModel.findOne({ token })
        if (logout) {
            return res.status(401).json({ message: "Already Logged out" })
        }
        const decoded = jwt.verify(token, Config.JWT_SECRET)

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        req.user = user
        next()

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized" })
    }
}
