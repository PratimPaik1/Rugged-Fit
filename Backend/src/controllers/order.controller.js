import orderModels from "../models/order.models.js";
import Cart from "../models/cart.models.js";
import { stockVarientCheck } from '../dao/product.dao.js'
import productModel from "../models/product.model.js";
import SellerOrder from "../models/sellerOrder.models.js";
import { UserAddress } from "../models/userAddress.model.js";
import mongoose from "mongoose";
import { userOrder, sellerOrder } from "../dao/order.dao.js";
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { cartId, addressId, paymentMode } = req.body;
        const userId = req.user.id;

        if (!addressId) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "addressId is required to place an order"
            });
        }

        const userAddress = await UserAddress.findOne({
            _id: addressId,
            userId
        }).session(session);

        if (!userAddress) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Selected address not found"
            });
        }

        const orderAddress = {
            addressLine1: userAddress.addressLine1,
            addressLine2: userAddress.addressLine2,
            city: userAddress.city,
            state: userAddress.state,
            pincode: userAddress.pincode
        };

        const chosenPaymentMode = paymentMode || "COD";

        const cart = await Cart.findOne({
            _id: cartId,
            userId
        }).session(session);

        if (!cart) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        if (cart.items.length === 0) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Stock check
        for (const item of cart.items) {
            const stock = await stockVarientCheck(item.variant);

            if (stock < item.quantity) {
                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({
                    success: false,
                    message: "Stock not available"
                });
            }
        }

        // Calculate total
        let totalPrice = 0;

        for (const item of cart.items) {
            totalPrice += item.price * item.quantity;
        }

        if (totalPrice < 1000) {
            totalPrice += 50;
        }

        const products = cart.items.map(item => ({
            productId: item.variant,
            qty: item.quantity,
            price: item.price,
            mrp: item.mrp
        }));

        // Create order
        const order = await orderModels.create([{
            userId,
            products,
            orderTotal: totalPrice,
            orderStatus: "pending",
            address: orderAddress,
            paymentMode: chosenPaymentMode
        }], { session });

        // Clear cart
        await Cart.findByIdAndUpdate(
            cartId,
            { items: [] },
            { session }
        );

        // Group cart items by seller
        const itemsBySeller = {};
        for (const item of cart.items) {
            const product = await productModel.findOne({
                "variants._id": item.variant
            }).session(session);

            if (!product) {
                await session.abortTransaction();
                session.endSession();

                return res.status(404).json({
                    success: false,
                    message: "Product variant not found"
                });
            }

            const sellerId = product.seller.toString();
            if (!itemsBySeller[sellerId]) {
                itemsBySeller[sellerId] = [];
            }

            itemsBySeller[sellerId].push({
                productId: item.variant,
                qty: item.quantity,
                price: item.price
            });
        }

        // Create seller orders
        for (const [sellerId, productsList] of Object.entries(itemsBySeller)) {
            await SellerOrder.create([{
                sellerId: new mongoose.Types.ObjectId(sellerId),
                orderId: order[0]._id,
                orderStatus: "pending",
                products: productsList,
                address: orderAddress,
                paymentMode: chosenPaymentMode
            }], { session });
        }

        // Update stock
        for (const item of cart.items) {
            await productModel.updateOne(
                { "variants._id": item.variant },
                {
                    $inc: {
                        "variants.$.stock": -item.quantity
                    }
                },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order: order[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getUserOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const order = await userOrder(userId);

        return res.status(200).json({
            success: true,
            order
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getSellerOrder = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const order = await sellerOrder(sellerId);

        return res.status(200).json({
            success: true,
            order
        });
    }
    catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { id } = req.params;
        const { orderStatus } = req.body;
        const sellerId = req.user.id;

        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: "orderStatus is required"
            });
        }

        const order = await SellerOrder.findOneAndUpdate(
            { _id: id, sellerId },
            { orderStatus },
            { new: true }
        );
        const userOrder = await orderModels.findOneAndUpdate(
            { _id: order.orderId },
            { orderStatus },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.log(error);

        await session.commitTransaction();
        session.endSession();
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

