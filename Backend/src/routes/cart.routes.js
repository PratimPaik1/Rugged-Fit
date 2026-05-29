import { Router } from "express";
import { addToCart, getCart, updateCartQuantity, removeCartItem } from "../controllers/cart.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { addToCartValidation, updateCartQuantityValidation } from "../validator/cart.validator.js";

const cartRouter = Router();

cartRouter.post('/add-to-cart', authenticateUser, addToCartValidation, addToCart)
cartRouter.get('/get-cart', authenticateUser, getCart)
cartRouter.put('/update-quantity', authenticateUser, updateCartQuantityValidation, updateCartQuantity)
cartRouter.delete('/remove-item/:variantId', authenticateUser, removeCartItem)

export default cartRouter