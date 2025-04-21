import express from "express";
import { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
export const productRouter = express.Router();

productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProduct);
productRouter.post("/products", createProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);
