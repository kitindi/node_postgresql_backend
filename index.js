import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { productRouter } from "./routes/productRoutes.js";
import { pool } from "./services/database.js";

const app = express();

const port = process.env.PORT || 3500;

// middleware
app.use(bodyParser.json());
app.use(express.json());
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

// Products API endpoints

app.use("/", productRouter);

app.listen(port, () => {
  console.log(`first server is running on port ${port} at http://localhost:${port}`);
});
