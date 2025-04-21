import express from "express";
import { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
export const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);
