import { body, validationResult } from "express-validator";

function validateReq(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const addToCartValidation = [
    body("variant").notEmpty().withMessage("Variant is required"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("mrp").notEmpty().withMessage("MRP is required"),
    validateReq
];

export const updateCartQuantityValidation = [
    body("variantId").notEmpty().withMessage("Variant ID is required"),
    body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validateReq
];