import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDb();

// Middleware
app.use(cors());
app.use(express.json());

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
