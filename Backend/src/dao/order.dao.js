import Order from "../models/order.models.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import SellerOrder from "../models/sellerOrder.models.js";
export const userOrder = async (userId) => {
  const result = await Order.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId)
      }
    },

    {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true
      }
    },

    // Existing product lookup
    {
      $lookup: {
        from: "products",
        let: {
          productVarientId:
            "$products.productId"
        },
        pipeline: [
          {
            $unwind: "$variants"
          },
          {
            $match: {
              $expr: {
                $eq: [
                  "$variants._id",
                  "$$productVarientId"
                ]
              }
            }
          },
          {
            $project: {
              _id: 1,

              title:
                "$variants.title",

              image: {
                $arrayElemAt: [
                  "$variants.images.url",
                  0
                ]
              }
            }
          }
        ],
        as: "products.info"
      }
    },

    // Seller lookup
    {
      $lookup: {
        from: "users",
        localField:
          "products.sellerId",
        foreignField: "_id",
        as: "sellerInfo"
      }
    },

    {
      $unwind: {
        path: "$sellerInfo",
        preserveNullAndEmptyArrays: true
      }
    },

    // Add seller details inside products
    {
      $addFields: {
        "products.seller": {
          _id: "$sellerInfo._id",
          fullName:
            "$sellerInfo.fullName"
        }
      }
    },

    {
      $group: {
        _id: "$_id",
        userId: {
          $first: "$userId"
        },
        orderTotal: {
          $first: "$orderTotal"
        },
        orderStatus: {
          $first: "$orderStatus"
        },
        address: {
          $first: "$address"
        },
        paymentMode: {
          $first: "$paymentMode"
        },
        createdAt: {
          $first: "$createdAt"
        },
        updatedAt: {
          $first: "$updatedAt"
        },
        __v: {
          $first: "$__v"
        },
        products: {
          $push: "$products"
        }
      }
    }

  ],
    {
      maxTimeMS: 60000,
      allowDiskUse: true
    });
  return result
}

export const sellerOrder = async (sellerId) => {
  const result = await SellerOrder.aggregate([
    {
      $match: {
        sellerId: new mongoose.Types.ObjectId(sellerId)
      }
    },

    {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $lookup: {
        from: "products",
        let: {
          variantId: "$products.productId"
        },
        pipeline: [
          {
            $unwind: "$variants"
          },
          {
            $match: {
              $expr: {
                $eq: [
                  "$variants._id",
                  "$$variantId"
                ]
              }
            }
          },
          {
            $project: {
              _id: 1,
              title: "$variants.title",
              image: {
                $arrayElemAt: [
                  "$variants.images.url",
                  0
                ]
              }
            }
          }
        ],
        as: "productInfo"
      }
    },

    {
      $addFields: {
        "products.productTitle": {
          $ifNull: [
            {
              $arrayElemAt: [
                "$productInfo.title",
                0
              ]
            },
            null
          ]
        },

        "products.productImage": {
          $ifNull: [
            {
              $arrayElemAt: [
                "$productInfo.image",
                0
              ]
            },
            null
          ]
        },

        "products.lineTotal": {
          $multiply: [
            "$products.qty",
            "$products.price"
          ]
        }
      }
    },

    {
      $lookup: {
        from: "ordermodels",
        localField: "orderId",
        foreignField: "_id",
        as: "parentOrder"
      }
    },

    {
      $group: {
        _id: "$_id",
        sellerId: {
          $first: "$sellerId"
        },
        orderId: {
          $first: "$orderId"
        },
        orderStatus: {
          $first: "$orderStatus"
        },
        address: {
          $first: "$address"
        },
        paymentMode: {
          $first: "$paymentMode"
        },
        __v: {
          $first: "$__v"
        },
        createdAt: {
          $first: { $arrayElemAt: ["$parentOrder.createdAt", 0] }
        },

        products: {
          $push: {
            _id: "$products._id",
            productId:
              "$products.productId",
            productTitle:
              "$products.productTitle",
            productImage:
              "$products.productImage",
            qty: "$products.qty",
            price: "$products.price",
            lineTotal:
              "$products.lineTotal"
          }
        },

        subtotal: {
          $sum:
            "$products.lineTotal"
        }
      }
    },

    {
      $addFields: {
        shippingCharge: {
          $cond: [
            {
              $lt: [
                "$subtotal",
                1000
              ]
            },
            50,
            0
          ]
        },

        taxRate: 18,

        totalTaxAmount: {
          $round: [
            {
              $multiply: [
                "$subtotal",
                {
                  $divide: [18, 118]
                }
              ]
            },
            2
          ]
        }
      }
    },

    {
      $addFields: {
        total: {
          $add: [
            "$subtotal",
            "$shippingCharge"
          ]
        }
      }
    },
    {
      $lookup: {
        from: "ordermodels",
        localField: "orderId",
        foreignField: "_id",
        as: "parentOrderDetails"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "parentOrderDetails.userId",
        foreignField: "_id",
        as: "buyerDetails"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "sellerId",
        foreignField: "_id",
        as: "sellerDetails"
      }
    },
    {
      $addFields: {
        buyer: {
          $arrayElemAt: [
            {
              $map: {
                input: "$buyerDetails",
                as: "b",
                in: {
                  fullname: "$$b.fullname",
                  email: "$$b.email",
                  contact: "$$b.contact"
                }
              }
            },
            0
          ]
        },
        buyerAddress: "$address",
        seller: {
          $arrayElemAt: [
            {
              $map: {
                input: "$sellerDetails",
                as: "s",
                in: {
                  fullname: "$$s.fullname",
                  email: "$$s.email",
                  contact: "$$s.contact"
                }
              }
            },
            0
          ]
        }
      }
    }
  ],
    {
      maxTimeMS: 60000,
      allowDiskUse: true
    });


  return result;
}
