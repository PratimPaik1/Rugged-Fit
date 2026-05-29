import { body, validationResult } from "express-validator";

function validateReq(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const registerUserValidation = [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("fullname").notEmpty().withMessage("Full name is required"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches("^\\d{10}$").withMessage("Contact is invalid"),

    validateReq
];

export const loginUserValidation = [
    body("identifier").notEmpty().withMessage("identifier is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateReq
];