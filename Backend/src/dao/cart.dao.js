import mongoose from "mongoose";
import cartModel from "../models/cart.models.js";

export async function getCartDao(userId) {
    try {
        const cart = await cartModel.aggregate(

            [
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },

                {
                    $unwind: {
                        path: "$items",
                        preserveNullAndEmptyArrays: true
                    }
                },

                {
                    $lookup: {
                        from: "products",
                        localField: "items.variant",
                        foreignField: "variants._id",
                        as: "product"
                    }
                },

                {
                    $addFields: {
                        matchedProduct: {
                            $arrayElemAt: ["$product", 0]
                        }
                    }
                },

                {
                    $addFields: {
                        "items.selectedVariant": {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: "$matchedProduct.variants",
                                        as: "variant",
                                        cond: {
                                            $eq: [
                                                "$$variant._id",
                                                "$items.variant"
                                            ]
                                        }
                                    }
                                },
                                0
                            ]
                        }
                    }
                },

                {
                    $addFields: {
                        // selling price from variant
                        "items.current_price":
                            "$items.selectedVariant.sellingPrice",

                        // original price from variant
                        "items.current_mrp":
                            "$items.selectedVariant.price"
                    }
                },

                {
                    $addFields: {
                        "items.itemTotal": {
                            $cond: {
                                if: { $eq: ["$items.isOutOfStock", true] },
                                then: 0,
                                else: {
                                    $multiply: [
                                        "$items.quantity",
                                        "$items.current_price"
                                    ]
                                }
                            }
                        },

                        "items.itemMRPTotal": {
                            $cond: {
                                if: { $eq: ["$items.isOutOfStock", true] },
                                then: 0,
                                else: {
                                    $multiply: [
                                        "$items.quantity",
                                        "$items.current_mrp"
                                    ]
                                }
                            }
                        }
                    }
                },

                {
                    $unset: [
                        "product",
                        "matchedProduct"
                    ]
                },

                {
                    $group: {
                        _id: "$_id",

                        userId: { $first: "$userId" },

                        totalPrice: {
                            $sum: "$items.itemTotal"
                        },

                        totalMRP: {
                            $sum: "$items.itemMRPTotal"
                        },

                        totalDiscount: {
                            $sum: {
                                $subtract: [
                                    "$items.itemMRPTotal",
                                    "$items.itemTotal"
                                ]
                            }
                        },

                        taxAmount: {
                            $first: "$taxAmount"
                        },

                        taxRate: {
                            $first: "$taxRate"
                        },

                        shipingCharge: {
                            $first: "$shipingCharge"
                        },

                        finalAmount: {
                            $sum: "$items.itemTotal"
                        },

                        __v: { $first: "$__v" },

                        items: { $push: "$items" }

                    }
                },
                {
                    $addFields: {
                        items: {
                            $filter: {
                                input: "$items",
                                as: "item",
                                cond: {
                                    $and: [
                                        { $ne: ["$$item.variant", null] },
                                        { $ne: [{ $type: "$$item.variant" }, "missing"] }
                                    ]
                                }
                            }
                        },
                        totalDiscountPercent: {
                            $cond: {
                                if: { $gt: ["$totalMRP", 0] },
                                then: {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$totalDiscount",
                                                "$totalMRP"
                                            ]
                                        },
                                        100
                                    ]
                                },
                                else: 0
                             }
                        },
                        shipingCharge: {
                            $cond: { if: { $gt: ["$totalPrice", 1000] }, then: 0, else: 50 }
                        },
                        taxAmount: {
                            $divide: [{ $multiply: ["$totalPrice", "$taxRate"] }, 100]
                        }
                    }
                },
                {
                    $addFields: {
                        finalAmount: {
                            $add: ["$totalPrice", "$shipingCharge"]
                        }
                    }
                }]
        )

        return cart;
    }
    catch (error) {
        throw error
    }
}

export async function addToCartDao(userId, variantId, quantity, finalPrice, image, title, description, mrp, stockVarient) {
    try {
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            if (quantity > stockVarient) {
                throw new Error(`Only ${stockVarient} items available`);
            }
            cart = new cartModel({
                userId,
                items: [{ variant: variantId, quantity, price: finalPrice, image, title, description, mrp }],
                totalPrice: 0,
                totalDiscount: 0,
                totalMRP: 0,
                taxAmount: 0,
                taxRate: 18,
                shipingCharge: 0,
                totalDiscountPercent: 0,
                finalAmount: 0
            });
        } else {
            const existingItem = cart.items.find(
                item => item.variant.toString() === variantId.toString()
            );
            if (existingItem) {
                if (existingItem.quantity + quantity > stockVarient) {
                    throw new Error(`Cannot add more. Only ${stockVarient} items available in total.`);
                }
                existingItem.quantity += quantity;
                existingItem.isOutOfStock = false;
                existingItem.message = existingItem.quantity >= stockVarient ? `Only ${stockVarient} left` : "";
            } else {
                if (quantity > stockVarient) {
                    throw new Error(`Only ${stockVarient} items available`);
                }
                const message = quantity >= stockVarient ? `Only ${stockVarient} left` : "";
                cart.items.push({ variant: variantId, quantity, price: finalPrice, image, title, description, mrp, message, isOutOfStock: false });
            }
        }

        await cart.save();

        // Return the pipeline-enriched cart
        const updatedCartData = await getCartDao(userId);
        return updatedCartData.length > 0 ? updatedCartData[0] : cart;
    } catch (error) {
        throw error;
    }
}
