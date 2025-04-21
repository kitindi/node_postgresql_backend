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

// GET : all products /products

app.get("/products", async (req, res) => {
  try {
    // const results = await pool.query(
    //   "SELECT product.name as Product_Name, product.price, category.name as Category FROM product INNER JOIN category ON category.id = product.category_id"
    // );

    const results = await pool.query("SELECT * FROM product");
    if (results.rows.length === 0) {
      return res.status(204).json({ message: "No products found" });
    }
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /products/:id
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM product WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// POST : Create new product /products

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

// PUT : Update product /products/:id

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, category_id } = req.body;
  try {
    const result = await pool.query("UPDATE product SET name = $1, description = $2, price = $3, quantity = $4, category_id = $5 WHERE id = $6 RETURNING *", [
      name,
      description,
      price,
      quantity,
      category_id,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE : Delete product /products/:id
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM product WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`first server is running on port ${port} at http://localhost:${port}`);
});
