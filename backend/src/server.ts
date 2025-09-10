import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
