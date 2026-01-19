const express = require("express");
const { connectDB } = require("./config/db.js");
const authRoutes = require("./routes/auth.route.js");

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo API is running...");
});
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error occurred!!" });
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
