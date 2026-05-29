import { UserAddress } from "../models/userAddress.model.js";

// Get all addresses for the logged-in user
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await UserAddress.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            addresses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Add a new address
export const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressLine1, addressLine2, city, state, pincode } = req.body;

        if (!addressLine1 || !addressLine2 || !city || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: "All address fields are required"
            });
        }

        const address = await UserAddress.create({
            userId,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode
        });

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update an existing address
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { addressLine1, addressLine2, city, state, pincode } = req.body;

        const address = await UserAddress.findOneAndUpdate(
            { _id: id, userId },
            { addressLine1, addressLine2, city, state, pincode },
            { new: true, runValidators: true }
        );

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete an address
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const address = await UserAddress.findOneAndDelete({ _id: id, userId });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
