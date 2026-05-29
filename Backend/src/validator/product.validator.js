import { body, query, param, validationResult } from 'express-validator';



const handleError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(400).json({ status: "error", message: "Validation failed", errors: errors.array() });
    }
    next();
}

const productValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("priceAmount").isNumeric().withMessage("Price amount must be a number"),
    body("priceCurrency").notEmpty().withMessage("Price currency is required"),
    handleError
]

export default productValidator;