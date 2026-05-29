import Product from "../models/product.model.js";

export const stockVarientCheck = async (varientId) => {
    const product = await Product.findOne(
        { "variants._id": varientId },
        { "variants.$": 1 }
    );

    if (product && product.variants && product.variants.length > 0) {
        // console.log(product.variants[0].stock);
        return product.variants[0].stock;
    }

    return 0;
};