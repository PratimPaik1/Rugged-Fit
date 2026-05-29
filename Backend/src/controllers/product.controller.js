import express from "express";
import { uploadFile } from "../services/stroge.service.js";
import productModel from "../models/product.model.js";

export const addProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, sellingPriceAmount, priceCurrency, category, stock, variants, baseImageCount } = req.body;

        const allUploadedFiles = await Promise.all(req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }))

        // Distribute images
        const baseImgCount = parseInt(baseImageCount) || allUploadedFiles.length;
        const baseImages = allUploadedFiles.slice(0, baseImgCount);
        let remainingImages = allUploadedFiles.slice(baseImgCount);

        let variantsData = [];

        // Base variant from product details
        variantsData.push({
            price: priceAmount,
            sellingPrice: sellingPriceAmount || priceAmount,
            stock: stock || 0,
            title: title + " - Standard",
            description: description,
            attributes: { size: "Standard" },
            images: baseImages
        });

        if (variants) {
            try {
                const parsedVariants = JSON.parse(variants);
                if (parsedVariants.length > 0) {
                    // Map images to variants based on imageCount
                    const variantsWithImages = parsedVariants.map(v => {
                        const vImgCount = parseInt(v.imageCount) || 0;
                        const vImages = remainingImages.splice(0, vImgCount);
                        return {
                            ...v,
                            images: vImages
                        };
                    });
                    variantsData = [...variantsData, ...variantsWithImages];
                }
            } catch (error) {
                console.error("Error parsing variants:", error);
            }
        }

        const product = await productModel.create({
            seller: req.user.id,
            title,
            description,
            price: {
                amount: priceAmount,
                sellingPrice: sellingPriceAmount || priceAmount,
                currency: priceCurrency
            },
            category: category || "apparel",
            images: baseImages,
            variants: variantsData
        })

        res.status(200).json({
            status: "success",
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.error("Error in adding product:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


export const getAllProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const products = await productModel.find({ seller: sellerId })
        if (products.length === 0) {
            return res.status(404).json({
                status: "success",
                message: "No products found",

            });
        }
        res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Error in fetching products:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const sellerId = req.user.id;

        const product = await productModel.findOneAndDelete({ _id: productId, seller: sellerId });

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found or unauthorized"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleting product:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            products
        });
    }
    catch (err) {
        console.error("Error in fetching products:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
}

export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        let products = [];

        if (q) {
            // "Elastic-like" full text search using MongoDB's $text operator
            products = await productModel.find(
                { $text: { $search: q } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });

            // If text search doesn't return anything, fallback to a fuzzy regex search
            if (products.length === 0) {
                products = await productModel.find({
                    $or: [
                        { title: { $regex: q, $options: 'i' } },
                        { description: { $regex: q, $options: 'i' } },
                        { category: { $regex: q, $options: 'i' } }
                    ]
                });
            }
        } else {
            products = await productModel.find();
        }

        res.status(200).json({
            status: "success",
            message: "Products fetched successfully",
            products
        });
    } catch (err) {
        console.error("Error in searching products:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        res.status(200).json({
            status: "success",
            message: "Product fetched successfully",
            product
        });
    }
    catch (err) {
        console.error("Error in fetching product:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        })
    }
}



export const updateProduct = async (req, res) => {
    try {
        const files = req.files;
        const productId = req.params.id;
        const userId = req.user.id;
        const product = await productModel.findOne({
            _id: productId,
            seller: userId
        });

        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found"
            });
        }
        const { title, description, priceAmount, sellingPriceAmount, priceCurrency, category, attributes, stock, price, sellingPrice, variants, editingVariantIndex } = req.body;

        let images = [];
        if (files && files.length !== 0) {
            images = await Promise.all(files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
            }))
        }

        let updateData = {
            title,
            description,
            price: {
                amount: priceAmount,
                sellingPrice: sellingPriceAmount || product.price.sellingPrice,
                currency: priceCurrency
            },
            category: category || product.category
        };

        // If 'variants' is provided as a JSON string, use it.
        // Otherwise, use the individual fields for a single variant.
        if (variants) {
            try {
                const parsedVariants = JSON.parse(variants);
                // If there are newly uploaded images, assign them to the appropriate variant
                if (images.length > 0) {
                    if (editingVariantIndex !== undefined && editingVariantIndex !== null && editingVariantIndex !== "") {
                        const idx = parseInt(editingVariantIndex);
                        if (parsedVariants[idx]) {
                            parsedVariants[idx].images = [...(parsedVariants[idx].images || []), ...images];
                        }
                    } else {
                        // Adding a new variant
                        for (let v of parsedVariants) {
                            if (!v.images || v.images.length === 0) {
                                v.images = images;
                                break;
                            }
                        }
                    }
                }

                updateData.variants = parsedVariants.map((v, index) => {
                    if (v._id) {
                        return v;
                    }
                    if (product.variants && product.variants[index]) {
                        v._id = product.variants[index]._id;
                    }
                    return v;
                });
            } catch (e) {
                console.error("Error parsing variants:", e);
            }
        } else if (attributes || stock || price || images.length > 0) {
            // Backward compatibility for single variant update
            updateData.variants = [
                {
                    attributes: attributes ? JSON.parse(attributes) : { size: "Standard" },
                    stock: stock || 0,
                    price: price || priceAmount,
                    sellingPrice: sellingPrice || sellingPriceAmount || price || priceAmount,
                    title: title + " - Standard",
                    description: description,
                    images: images.length > 0 ? images : (product.variants[0]?.images || [])
                }
            ];
        }

        // Final check: Ensure at least one variant exists
        if ((!updateData.variants || updateData.variants.length === 0) && (!product.variants || product.variants.length === 0)) {
            updateData.variants = [{
                price: priceAmount || product.price.amount,
                sellingPrice: sellingPriceAmount || product.price.sellingPrice,
                stock: stock || 0,
                title: title || product.title + " - Standard",
                description: description || product.description,
                attributes: { size: "Standard" },
                images: images.length > 0 ? images : product.images
            }];
        }

        const updatedProduct = await productModel.findOneAndUpdate(
            { _id: productId, seller: userId },
            { $set: updateData },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({
                status: "error",
                message: "Product not found or unauthorized"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error in updating product:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}


export const getProductBySeller = async (req, res) => {
    try {
        const id = req.params.id;

        const userId = req.user.id;
        const product = await productModel.findOne({ _id: id, seller: userId });
        if (!product) {
            return res.status(404).json({
                status: "error",
                message: "Product not found"
            })
        }
        res.status(200).json({
            status: "success",
            message: "Product fetched successfully",
            products: product
        });
    } catch (error) {
        console.error("Error in fetching products:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
}