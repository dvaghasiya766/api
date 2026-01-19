const httpModel = require("../models/httpError.model.js");
const bcrypt = require("bcryptjs");
const { pool } = require("../config/db.js");
const { validationResult } = require("express-validator");

const registerUser = async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new httpModel(errors.array()[0].msg, 422));
  }

  try {
    // Logic for user registration
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id";
    const result = await pool.query(query, [username, email, hashedPassword]);
    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });
  } catch (e) {
    if (e.code === "23505") {
      return next(new httpModel("Email already exists", 409));
    }
    return next(new httpModel("Registration failed", 500));
  }
};

module.exports = {
  registerUser,
};
