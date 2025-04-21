import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { pool } from "./services/database.js";

const app = express();

const port = process.env.PORT || 3500;

// middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM category");
    return res.status(200).json(categories.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all products

app.get("/products", async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT product.name as Product_Name, product.price, category.name as Category FROM product INNER JOIN category ON category.id = product.category_id"
    );
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Create new product

app.post("/products", async (req, res) => {
  const { name, description, price, quantity, category_id } = req.body;

  try {
    if (!name) {
      return res.status(204).json({ message: "Product name is required" });
    }
    if (!price) {
      return res.status(204).json({ message: "Product price is required" });
    }
    if (!quantity) {
      return res.status(204).json({ message: "Product quantity is required" });
    }
    if (!category_id) {
      return res.status(204).json({ message: "Product category is required" });
    }

    const result = await pool.query("INSERT INTO product (name, description, price, quantity,category_id) values ($1, $2, $3, $4,$5) RETURNING *", [
      name,
      description,
      price,
      quantity,
      category_id,
    ]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`first server is running on port ${port} at http://localhost:${port}`);
});
