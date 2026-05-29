import { Router } from "express";
import { registerUserValidation, loginUserValidation } from "../validator/auth.validator.js";
import { registerUser, loginUser, googleCallback, getMe, logoutUser } from "../controllers/auth.controller.js"
import passport from "passport";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { Config } from "../config/config.js";
const authRouter = Router();


authRouter.post('/register', registerUserValidation, registerUser);

authRouter.post('/login', loginUserValidation, loginUser);


// Route to initiate Google OAuth flow
authRouter.get('/google', (req, res, next) => {
    const { role } = req.query;
    // Pass role in state so it's available in the callback
    const state = role ? Buffer.from(JSON.stringify({ role })).toString('base64') : undefined;
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state: state
    })(req, res, next);
});
authRouter.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: Config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login" }), googleCallback
);

authRouter.get("/me", authenticateUser, getMe)
authRouter.post("/logout", authenticateUser, logoutUser)

export default authRouter;