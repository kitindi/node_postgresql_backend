import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;
// import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
