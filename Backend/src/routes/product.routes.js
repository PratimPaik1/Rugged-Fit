import express from "express";
import { authSellerMiddleware } from "../middlewares/auth.middlewares.js";
import { addProduct, getAllProductsBySeller, deleteProduct, getAllProduct, getProductById, updateProduct, getProductBySeller, searchProducts } from "../controllers/product.controller.js";
import productValidator from "../validator/product.validator.js"
import multer from "multer";


const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

const productRouter = express.Router();


productRouter.post("/add-product", authSellerMiddleware, upload.array("images", 10), productValidator, addProduct);

productRouter.get("/get-products-by-seller", authSellerMiddleware, getAllProductsBySeller)
productRouter.delete("/:id", authSellerMiddleware, deleteProduct);

productRouter.get("/", getAllProduct)

productRouter.get("/search/query", searchProducts)



productRouter.get("/:id", getProductById)


productRouter.put("/update/:id", authSellerMiddleware, upload.array("images", 10), updateProduct)

productRouter.get("/seller/:id", authSellerMiddleware, getProductBySeller)
export default productRouter;