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
router.get('/feedback', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
  f.id,
  f.comment,
  f.vehicle_rating,
  f.driver_rating,
  f.created_at,
  v.brand,
  v.model,
  u.name AS user_name,
  u.contact_number AS user_phone,
  d.name AS driver_name,
  d.phone AS driver_phone
FROM feedback f
LEFT JOIN vehicles v ON f.vehicle_id = v.id
LEFT JOIN users u ON f.user_id = u.id
LEFT JOIN drivers d ON f.driver_id = d.id
ORDER BY f.created_at DESC;

    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});


module.exports = router;
