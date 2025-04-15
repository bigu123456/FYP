// Routes/payment.routes.js
const express = require("express");
const { initiatePayment, paymentStatus } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/initiate-payment", initiatePayment);
router.post("/payment-status", paymentStatus);

module.exports = router;
