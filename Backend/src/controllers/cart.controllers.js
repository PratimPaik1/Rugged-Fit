import Cart from "../models/cart.models.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import { stockVarientCheck } from "../dao/product.dao.js";
import { getCartDao, addToCartDao } from "../dao/cart.dao.js";
export const addToCart = async (req, res) => {
    try {
        const { variant, quantity, price, image, title, description, productId, mrp } = req.body;
        console.log(mrp)
        const userId = req.user.id;

        const variantId = variant._id ? variant._id : variant;
        const finalPrice = typeof price === 'object' ? (price.sellingPrice || price.amount) : price;

        const stockVarient = await stockVarientCheck(variantId);
        if (stockVarient === 0) {
            return res.status(400).json({ message: "Item is out of stock" });
        }

        try {
            const cart = await addToCartDao(userId, variantId, quantity, finalPrice, image, title, description, mrp, stockVarient);
            return res.status(200).json({ message: "Item added to cart successfully", cart });
        } catch (daoError) {
            return res.status(400).json({ message: daoError.message });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cartDoc = await Cart.findOne({ userId });
        if (!cartDoc) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Real-time stock enrichment and auto-update
        let isModified = false;
        for (let item of cartDoc.items) {
            const currentStock = await stockVarientCheck(item.variant);

            let statusChanged = false;

            if (currentStock === 0) {
                if (!item.isOutOfStock || item.message !== "Out of Stock") {
                    item.isOutOfStock = true;
                    item.message = "Out of Stock";
                    statusChanged = true;
                }
            } else if (item.quantity >= currentStock) {
                const newMessage = `Only ${currentStock} left`;
                if (item.message !== newMessage) {
                    item.isOutOfStock = false;
                    item.message = newMessage;
                    statusChanged = true;
                }
            } else {
                if (item.isOutOfStock || item.message !== "") {
                    item.isOutOfStock = false;
                    item.message = "";
                    statusChanged = true;
                }
            }
            if (statusChanged) isModified = true;
        }

        if (isModified) {
            await cartDoc.save();
        }

        let cartData = await getCartDao(userId);
        let cart = cartData.length > 0 ? cartData[0] : null;

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { variantId, quantity } = req.body;
        const userId = req.user.id;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const stockVarient = await stockVarientCheck(variantId);
        if (quantity > stockVarient) {
            return res.status(400).json({ message: `Only ${stockVarient} items available` });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.items.find(item => item.variant.toString() === variantId.toString());
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.quantity = quantity;
        item.isOutOfStock = false;
        item.message = quantity >= stockVarient ? `Only ${stockVarient} left` : "";

        await cart.save();

        const updatedCartData = await getCartDao(userId);
        const updatedCart = updatedCartData.length > 0 ? updatedCartData[0] : cart;

        return res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { variantId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.variant.toString() !== variantId.toString());
        await cart.save();

        const updatedCartData = await getCartDao(userId);
        const updatedCart = updatedCartData.length > 0 ? updatedCartData[0] : null;

        return res.status(200).json({ message: "Item removed from cart successfully", cart: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
