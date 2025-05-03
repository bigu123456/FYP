const express = require("express");
const router = express.Router();
const pool = require("../db/Connection"); 

router.post("/submit", async (req, res) => {
  const {
    order_id,
    user_id,
    vehicle_id,
    driver_id,
    vehicle_rating,
    driver_rating,
    comment,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO feedback 
      (order_id, user_id, vehicle_id, driver_id, vehicle_rating, driver_rating, comment)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [order_id, user_id, vehicle_id, driver_id, vehicle_rating, driver_rating, comment]
    );

    res.status(201).json({ message: "Feedback submitted", feedback: result.rows[0] });
  } catch (error) {
    console.error("Error inserting feedback:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
