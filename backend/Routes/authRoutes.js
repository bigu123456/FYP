// authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { sendOTP, verifyOTP } = require("../controllers/otpController");


// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);
router.post("/generateOtp",sendOTP);
router.post("/verifyOtp",verifyOTP);



module.exports = router;
