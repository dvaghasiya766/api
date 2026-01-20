const httpModel = require("../models/httpError.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    // Check User is Already Exist or Not
    const existingUserQuery = "SELECT * FROM users WHERE email = $1";
    const existingUserResult = await pool.query(existingUserQuery, [email]);
    if (existingUserResult.rows.length > 0) {
      console.log("Email already in use:", email);
      return next(new httpModel("Email already in use", 409));
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create New User
    const query =
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id";
    const result = await pool.query(query, [username, email, hashedPassword]);
    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].user_id,
    });
  } catch (e) {
    console.log(e.code);
    if (e.code === "23505") {
      return next(new httpModel("Email already exists", 409));
    }
    return next(new httpModel("Registration failed", 500));
  }
};

const logInUser = async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new httpModel(errors.array()[0].msg, 422));
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);
    console.log(userResult.rows);
    if (userResult.rows.length === 0) {
      return next(new httpModel("Invalid credentials", 401));
    }

    const user = userResult.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new httpModel("Invalid credentials", 401));
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.user_id,
    });
  } catch (e) {
    return next(new httpModel("Registration failed", 500));
  }
};

module.exports = {
  registerUser,
  logInUser,
};
