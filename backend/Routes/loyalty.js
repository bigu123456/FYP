const express = require("express");
const pool = require("../db/Connection");

const router = express.Router();

async function updateLoyaltyPoints(userId) {
  try {
    // Fetch the number of completed bookings for the user
    const orderCountQuery = await pool.query(
      "SELECT COUNT(*) AS order_count FROM orders WHERE user_id = $1",
      [userId]
    );
    const orderCount = parseInt(orderCountQuery.rows[0].order_count, 10);

    // Determine bonus points based on the number of orders
    let bonusPoints = 0;
    if (orderCount >= 25) {
      bonusPoints = 500; // 500 points for 25+ orders
    } else if (orderCount >= 10) {
      bonusPoints = 250; // 250 points for 10-24 orders
    } else if (orderCount >= 5) {
      bonusPoints = 100; // 100 points for 5-9 orders
    }

    // Calculate total points as order count + bonus points
    const totalPoints = orderCount + bonusPoints;

    // Check if loyalty points exist for the user
    const existing = await pool.query("SELECT * FROM loyalty WHERE user_id = $1", [userId]);

    // Determine loyalty level based on total points
    let level = "Bronze";
    if (totalPoints >= 500) level = "Platinum";
    else if (totalPoints >= 300) level = "Gold";
    else if (totalPoints >= 100) level = "Silver";

    if (existing.rows.length > 0) {
      // Update loyalty points if user already has an entry
      await pool.query(
        "UPDATE loyalty SET points = $1, level = $2, updated_at = NOW() WHERE user_id = $3",
        [totalPoints, level, userId]
      );
    } else {
      // Create new loyalty entry if not exists (FIXED: Now using correct dynamic level)
      await pool.query(
        "INSERT INTO loyalty (user_id, points, level, updated_at) VALUES ($1, $2, $3, NOW())",
        [userId, totalPoints, level]
      );
    }
  } catch (error) {
    console.error("Error updating loyalty points:", error.message);
    throw new Error("Failed to update loyalty points");
  }
}

// Reset points when the user goes back to normal behavior
async function resetLoyaltyPoints(userId) {
  try {
    // Reset points for the user, they can start earning points again
    await pool.query(
      "UPDATE loyalty SET points = 0, level = 'Bronze', updated_at = NOW() WHERE user_id = $1",
      [userId]
    );
  } catch (error) {
    console.error("Error resetting loyalty points:", error.message);
    throw new Error("Failed to reset loyalty points");
  }
}

// Fetch loyalty level
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT level FROM loyalty WHERE user_id = $1",
      [userId]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({ level: "Bronze" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching loyalty data");
  }
});

module.exports = {
  loyaltyRouter: router,
  updateLoyaltyPoints,
  resetLoyaltyPoints
};
