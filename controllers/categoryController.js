import { pool } from "../services/database.js";

const getAllCategories = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM category");
    if (results.rows.length === 0) {
      return res.status(204).json({ message: "No categories found" });
    }
    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM category WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(204).json({ message: "Category name is required" });
    }

    // check if category name already exists
    const categoryExists = await pool.query("SELECT * FROM category WHERE name = $1", [name]);
    if (categoryExists.rows.length > 0) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const result = await pool.query("INSERT INTO category (name) values ($1) RETURNING *", [name]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(204).json({ message: "Category name is required" });
    }

    const result = await pool.query("UPDATE category SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete category

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // determine the number of products that share the same category id

    const productCount = await pool.query("SELECT COUNT(*) FROM product WHERE category_id = $1", [id]);
    const count = parseInt(productCount.rows[0].count, 10);
    if (count > 0) {
      return res.status(409).json({ message: "Cannot delete category with existing products" });
    }

    const result = await pool.query("DELETE FROM category WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory };
