import express from "express";
import { getUserAddresses, addAddress, updateAddress, deleteAddress } from "../controllers/address.controller.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/", authenticateUser, getUserAddresses);
router.post("/", authenticateUser, addAddress);
router.put("/:id", authenticateUser, updateAddress);
router.delete("/:id", authenticateUser, deleteAddress);

export default router;
