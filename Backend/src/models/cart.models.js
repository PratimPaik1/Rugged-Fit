import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    taxAmount: {
        type: Number,
        required: true
    },
    taxRate: {
        type: Number,
        required: true
    },
    shipingCharge: {
        type: Number,
        required: true
    },

    items: [
        {

            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'variant',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
            mrp: {
                type: Number,
                required: true
            },

            image: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            message: {
                type: String,
                default: ""
            },
            isOutOfStock: {
                type: Boolean,
                default: false
            }
        }
    ]
})

export default mongoose.model("Cart", cartSchema)