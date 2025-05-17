const express = require("express");
const router = express.Router();
const pool = require("../db/Connection"); 
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware"); // Import authentication middleware

// Endpoint to fetch all users
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users"); // Query to fetch all users from the "users" table
    res.json(result.rows); // Send the result as a JSON response
  } catch (err) {
    console.error("Error fetching users:", err); // Log any errors
    res.status(500).json({ message: "Error fetching users" }); // Send a generic error message
  }
});

// Endpoint to update user role
router.put("/users/:id/role", verifyToken, isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;  // Get role from request body
  
  // Validate that role is either "user" or "admin"
  if (role !== "user" && role !== "admin") {
    return res.status(400).json({ message: "Invalid role." });
  }

  try {
    // Update user's role in the database
    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
      [role, userId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User role updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Error updating user role" });
  }
});

module.exports = router;
