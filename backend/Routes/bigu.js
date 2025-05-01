// backend/Routes/bigu.js

const express = require('express');
const pool = require("../db/Connection"); // Adjust path as needed
const router = express.Router();

// POST request for /bigu
router.post("/bigu", async (req, res) => {
  const { email, phone } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO contacts (email, phone) VALUES ($1, $2) RETURNING *`,
      [email, phone]
    );
    res.status(201).json({ message: "Contact saved", contact: result.rows[0] });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
