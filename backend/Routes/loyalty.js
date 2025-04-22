const express = require("express");
const pool = require("../db/Connection");

const router = express.Router();

//  Update loyalty points based on rental details
async function updateLoyaltyPoints(userId, rentalPrice) {
  try {
    const pointsEarned = Math.round(rentalPrice);

    // Check if loyalty points exist for the user
    const existing = await pool.query("SELECT * FROM loyalty WHERE user_id = $1", [userId]);

    if (existing.rows.length > 0) {
      const newPoints = existing.rows[0].points + pointsEarned;
      let level = "Bronze";
      if (newPoints >= 500) level = "Platinum";
      else if (newPoints >= 300) level = "Gold";
      else if (newPoints >= 100) level = "Silver";

      // Update loyalty points
      await pool.query(
        "UPDATE loyalty SET points = $1, level = $2, updated_at = NOW() WHERE user_id = $3",
        [newPoints, level, userId]
      );
    } else {
      // Create new loyalty entry if not exists
      await pool.query(
        "INSERT INTO loyalty (user_id, points, level, updated_at) VALUES ($1, $2, 'Bronze', NOW())",
        [userId, pointsEarned]
      );
    }
  } catch (error) {
    console.error("Error updating loyalty points:", error.message);
    throw new Error("Failed to update loyalty points");
  }
}

// Get user profile with loyalty points and level
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user details
    const userQuery = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch loyalty details
    const loyaltyQuery = await pool.query("SELECT points, level FROM loyalty WHERE user_id = $1", [userId]);
    const loyalty = loyaltyQuery.rows[0] || { points: 0, level: "Bronze" };

    // Fetch completed orders count for the user
    const orderCountQuery = await pool.query(
      "SELECT COUNT(*) AS order_count FROM orders WHERE user_id = $1 AND status = 'completed'",
      [userId]
    );
    const orderCount = parseInt(orderCountQuery.rows[0].order_count, 10);

    res.json({
      success: true,
      user: userQuery.rows[0],
      loyalty,
      order_count: orderCount,
    });
  } catch (err) {
    console.error("Error fetching user profile with loyalty info:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all users and their loyalty points, ordered by points
router.get("/loyalty-users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         u.id AS id, u.name, u.email,
         COALESCE(l.points, 0) AS loyalty_points,
         COALESCE(l.level, 'Bronze') AS loyalty_level,
         (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.status = 'completed') AS order_count
       FROM users u
       LEFT JOIN loyalty l ON u.id = l.user_id
       ORDER BY loyalty_points DESC`
    );
    res.json({ success: true, users: result.rows });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = {
  loyaltyRouter: router,
  updateLoyaltyPoints
};
