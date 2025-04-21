import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import { productRouter } from "./routes/productRoutes.js";
import { pool } from "./services/database.js";
import { categoryRouter } from "./routes/categoryRoutes.js";

const app = express();

const port = process.env.PORT || 3500;

// middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Categories API endpoints
app.use("/categories", categoryRouter);
// Products API endpoints

app.use("/", productRouter);

app.listen(port, () => {
  console.log(`first server is running on port ${port} at http://localhost:${port}`);
});
