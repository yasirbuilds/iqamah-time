import express from "express";
import prisma from "./config/prisma";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ time: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
