import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema(
    {
        userId: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        addressLine1: {
            type: String,
            required: true,
            trim: true
        },
        addressLine2: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: String,
            required: true,
            trim: true
        },



    }
)

export const UserAddress = mongoose.model("UserAddress", userAddressSchema)