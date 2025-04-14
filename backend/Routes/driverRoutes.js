const express = require("express");
const pool = require("../db/Connection"); // Ensure this points to your database connection
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure uploads folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

/* ADD DRIVER*/
router.post("/drivers", upload.single("image"), async (req, res) => {
  const { name, phone, license_number } = req.body;

  if (!name || !phone || !license_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const imageFilename = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO drivers (name, phone, license_number, availability, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, phone, license_number, true, imageFilename] // Save image filename to DB
    );

    res.status(201).json({
      message: "Driver added successfully!",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


/*DELETE DRIVER */
router.delete("/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the driver exists
    const existingDriver = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
    if (existingDriver.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Delete the driver from the database
    await pool.query("DELETE FROM drivers WHERE id = $1", [id]);

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* UPDATE DRIVER (Including Availability) */
router.put("/drivers/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, phone, license_number, availability } = req.body; // Include availability

  try {
    // Check if the driver exists
    const existingDriver = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
    if (existingDriver.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Get the existing image filename (if available)
    let imageFilename = existingDriver.rows[0].image;
    
    // If a new image is uploaded, update the filename
    if (req.file) {
      imageFilename = req.file.filename;
    }

    // Update the driver details in the database, including availability
    const result = await pool.query(
      `UPDATE drivers 
       SET name = $1, phone = $2, license_number = $3, image = $4, availability = $5
       WHERE id = $6 RETURNING *`,
      [name, phone, license_number, imageFilename, availability, id]
    );

    res.status(200).json({ message: "Driver updated successfully", driver: result.rows[0] });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/*GET ALL DRIVERS */
router.get("/drivers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers");
    res.status(200).json({ drivers: result.rows });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to load drivers" });
  }
});

module.exports = router;
