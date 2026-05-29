import mongoose from "mongoose"

const sellerOrderSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
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
                ref: "Product"
            },
            qty: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]

})

const SellerOrder = mongoose.model("SellerOrder", sellerOrderSchema)

export default SellerOrder