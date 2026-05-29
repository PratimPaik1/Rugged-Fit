import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        orderTotal: {
            type: Number,
            required: true,
        },
        orderStatus: {
            type: String,
            enum: ["pending", "packed", "shipped", "delivered", "cancelled"],
            default: "pending"
        },
        address: {
            addressLine1: { type: String, required: true },
            addressLine2: { type: String, required: false },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true }
        },
        paymentMode: {
            type: String,
            enum: ["COD", "Card", "UPI"],
            required: true,
            default: "COD"
        },

        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "variant",
                    required: true,
                },

                qty: {
                    type: Number,
                    default: 1,
                    required: true,
                    min: 1,
                },

                price: {
                    type: Number,
                    required: true,
                },
                mrp: {
                    type: Number,
                    required: true
                }
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("orderModels", orderSchema);