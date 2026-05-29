import express from "express";
import { createOrder, getUserOrder, getSellerOrder, updateOrderStatus } from "../controllers/order.controller.js";
import { authenticateUser, authSellerMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create", authenticateUser, createOrder);
router.get("/user", authenticateUser, getUserOrder);
router.get("/seller", authSellerMiddleware, getSellerOrder);
router.put("/status/:id", authSellerMiddleware, updateOrderStatus);

export default router;