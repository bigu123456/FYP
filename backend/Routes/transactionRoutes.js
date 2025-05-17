


// routes/transactionRoutes.js
const express = require('express');
const pool = require("../db/Connection"); 
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Define the route for fetching transactions
router.get('/transactions', transactionController.getAllTransactions);

module.exports = router;
