const express = require("express");
const { connectDB } = require("./config/db.js");

const app = express();

// Connect Database
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
