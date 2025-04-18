const express = require("express");
const pool = require("../db/Connection");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ----------------------- ADD DRIVER ----------------------- */
router.post("/drivers", upload.single("image"), async (req, res) => {
  const { name, phone, email, license_number, description } = req.body;

  if (!name || !phone || !email || !license_number || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const imageFilename = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO drivers (name, phone, email, license_number, availability, image, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, phone, email, license_number, true, imageFilename, description]
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

/* ----------------------- DELETE DRIVER ----------------------- */
router.delete("/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existingDriver = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
    if (existingDriver.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    await pool.query("DELETE FROM drivers WHERE id = $1", [id]);
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ----------------------- UPDATE DRIVER ----------------------- */
router.put("/drivers/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, license_number, availability, description } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const current = existing.rows[0];

    const updatedName = name || current.name;
    const updatedPhone = phone || current.phone;
    const updatedEmail = email || current.email;
    const updatedLicense = license_number || current.license_number;
    const updatedAvailability =
      typeof availability !== "undefined" ? availability : current.availability;
    const updatedDescription = description || current.description;
    const updatedImage = req.file ? req.file.filename : current.image;

    const result = await pool.query(
      `UPDATE drivers 
       SET name = $1, phone = $2, email = $3, license_number = $4, image = $5, availability = $6, description = $7 
       WHERE id = $8 RETURNING *`,
      [
        updatedName,
        updatedPhone,
        updatedEmail,
        updatedLicense,
        updatedImage,
        updatedAvailability,
        updatedDescription,
        id,
      ]
    );

    res.status(200).json({ message: "Driver updated successfully", driver: result.rows[0] });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ----------------------- UPDATE DRIVER AVAILABILITY ONLY ----------------------- */
router.put("/drivers/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  if (typeof availability !== "boolean") {
    return res.status(400).json({ message: "Availability must be a boolean" });
  }

  try {
    const result = await pool.query(
      "UPDATE drivers SET availability = $1 WHERE id = $2 RETURNING *",
      [availability, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({
      message: "Driver availability updated",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ----------------------- GET ALL DRIVERS ----------------------- */
router.get("/drivers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers");
    res.status(200).json({ drivers: result.rows });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to load drivers" });
  }
});

/* ----------------------- GET SINGLE DRIVER ----------------------- */
router.get("/drivers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ driver: result.rows[0] });
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Failed to fetch driver" });
  }
});

module.exports = router;
