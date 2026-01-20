const express = require("express");
const { check } = require("express-validator");
const { registerUser, logInUser } = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/register",
  [
    check("username").notEmpty().withMessage("Username is required"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser,
);
router.post(
  "/login",
  [
    // check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  logInUser,
);

module.exports = router;
