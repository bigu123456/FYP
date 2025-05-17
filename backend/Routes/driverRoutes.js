const express = require("express");
const pool = require("../db/Connection");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Directory where images will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename for the image
  },
});

const upload = multer({ storage });

/* ----------------------- ADD DRIVER ----------------------- */
router.post("/drivers", upload.single("image"), async (req, res) => {
  try {
    const { name, phone, email, license_number, description, price_per_day } = req.body;
    const image = req.file ? req.file.filename : null; // Store image filename if it's provided

    // Insert the driver into the database
    const result = await pool.query(
      `INSERT INTO drivers 
       (name, phone, email, license_number, description, price_per_day, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, phone, email, license_number, description, price_per_day, image]
    );

    res.status(201).json(result.rows[0]); // Respond with the created driver details
  } catch (error) {
    console.error("Driver insert error:", error);

    if (error.code === "23505") {
      let field = "a field";
      if (error.constraint.includes("email")) field = "Email";
      else if (error.constraint.includes("phone")) field = "Phone number";
      else if (error.constraint.includes("license_number")) field = "License number";

      return res.status(409).json({ message: `${field} already exists.` });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

/* ----------------------- GET ALL DRIVERS WITH RATING ----------------------- */
router.get("/drivers", async (req, res) => {
  try {
    // SQL query to join drivers with feedback and calculate the average rating
    const result = await pool.query(`
      SELECT 
        d.*, 
        ROUND(AVG(f.driver_rating), 1) AS average_driver_rating,
        COUNT(f.driver_rating) AS rating_count
      FROM drivers d
      LEFT JOIN feedback f ON d.id = f.driver_id
      GROUP BY d.id
    `);

    res.status(200).json({ drivers: result.rows });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to load drivers" });
  }
});

/* ----------------------- GET A SINGLE DRIVER ----------------------- */
router.get("/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [parsedId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ driver: result.rows[0] });
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Failed to fetch driver" });
  }
});

/* ----------------------- UPDATE DRIVER ----------------------- */
router.put("/drivers/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, license_number, description, price_per_day, availability } = req.body;
  const image = req.file ? req.file.filename : null; // If a new image is uploaded, update the image filename

  try {
    // Update the driver in the database
    const result = await pool.query(
      `UPDATE drivers 
       SET name = $1, phone = $2, email = $3, license_number = $4, description = $5, price_per_day = $6, availability = $7, image = COALESCE($8, image)
       WHERE id = $9 RETURNING *`,
      [name, phone, email, license_number, description, price_per_day, availability, image, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver updated successfully",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Failed to update driver" });
  }
});

/* ----------------------- UPDATE DRIVER AVAILABILITY ----------------------- */
router.put("/drivers/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body; // The availability status to update

  try {
    // Check if availability status is a boolean
    if (typeof availability !== "boolean") {
      return res.status(400).json({ message: "Availability must be a boolean" });
    }

    // Update availability for the driver
    const result = await pool.query(
      `UPDATE drivers SET availability = $1 WHERE id = $2 RETURNING *`,
      [availability, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver availability updated successfully",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating driver availability:", error);
    res.status(500).json({ message: "Failed to update driver availability" });
  }
});

/* ----------------------- DELETE DRIVER ----------------------- */
router.delete("/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the driver from the database
    const result = await pool.query("DELETE FROM drivers WHERE id = $1 RETURNING *", [id]);

    // If no driver is found with the provided ID
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver deleted successfully",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Failed to delete driver" });
  }
});

module.exports = router;
