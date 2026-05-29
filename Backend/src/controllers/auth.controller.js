import userModel from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { Config } from "../config/config.js";
import logoutModel from "../models/logout.models.js";

async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, Config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })

}



export const registerUser = async (req, res) => {
    try {
        const { email, password, fullname, contact, isSeller } = req.body;
        const lowerEmail = email.toLowerCase();
        const isUserExist = await userModel.findOne({
            $or: [
                { email: lowerEmail },
                { contact }
            ]
        });

        if (isUserExist) {
            return res.status(400).json({ status: "Error", message: "User already exists" });

        }
        const user = await userModel.create({ email: lowerEmail, password, fullname, contact, role: isSeller ? "seller" : "buyer" });

        if (!user) {
            return res.status(500).json({ status: "Error", message: "Failed to create user" });
        }
        user.password = undefined;
        await sendTokenResponse(user, res, "User registered successfully")
    } catch (error) {
        console.error("Error in user registration:", error);
    }
}

export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const lowerIdentifier = identifier.toLowerCase();
        const user = await userModel.findOne({ $or: [{ email: lowerIdentifier }, { contact: identifier }] }).select("+password");
        if (!user) {
            return res.status(400).json({ status: "Error", message: "Invalid credential" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ status: "Error", message: "Invalid credential" });
        }
        user.password = undefined;
        await sendTokenResponse(user, res, "User logged in successfully")
    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

export const googleCallback = async (req, res) => {
    try {
        const { id, displayName, emails } = req.user;
        const { state } = req.query;

        let role = "buyer";
        if (state) {
            try {
                const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
                if (decodedState.role === "seller") role = "seller";
            } catch (e) {
                console.error("Error decoding state:", e);
            }
        }

        const email = emails[0].value;
        let user = await userModel.findOne({ email })
        if (!user) {
            user = await userModel.create({ email, fullname: displayName, role, googleId: id })
        }
        const token = jwt.sign({ id: user._id, role: user.role }, Config.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token)

        const isDev = Config.NODE_ENV === "development";
        const frontendUrl = isDev ? "http://localhost:5173" : "";
        const targetPath = user.role === "seller" ? "/dashboard" : "/";

        const redirectUrl = `${frontendUrl}${targetPath}`;

        console.log(`Redirecting user (${user.role}) to: ${redirectUrl}`);
        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Error in user login:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


export const getMe = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }
        user.password = undefined;
        res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        });
    } catch (error) {
        console.error("Error in fetching user:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

export const logoutUser = async (req, res) => {
    try {
        const { token } = req.cookies;
        const { id } = req.user;
        const logout = await logoutModel.create({ token, user: id });
        if (!logout) {
            return res.status(500).json({ status: "Error", message: "Failed to logout user" });
        }
        res.clearCookie("token");
        res.status(200).json({
            message: "User logged out successfully",
            success: true
        });
    } catch (error) {
        console.error("Error in user logout:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

