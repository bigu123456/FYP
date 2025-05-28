const express = require("express");
const pool = require("../db/Connection");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* ----------------------- ADD DRIVER ----------------------- */
router.post("/drivers", upload.single("image"), async (req, res) => {
  const { name, phone, email, license_number, description, price_per_day } = req.body;
  const imageFilename = req.file ? req.file.filename : null;

  if (!name || !phone || !email || !license_number || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO drivers 
       (name, phone, email, license_number, availability, image, description, price_per_day)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, phone, email, license_number, true, imageFilename, description, price_per_day]
    );

    res.status(201).json({
      message: "Driver added successfully!",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Driver insert error:", error);

    if (error.code === "23505") {
      let field = "a field";
      if (error.constraint.includes("email")) field = "Email";
      else if (error.constraint.includes("phone")) field = "Phone number";
      else if (error.constraint.includes("license_number")) field = "License number";
      return res.status(409).json({ message: `${field} already exists.` });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ----------------------- GET ALL DRIVERS WITH RATING ----------------------- */
router.get("/drivers", async (req, res) => {
  try {
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
    if (isNaN(parsedId)) return res.status(400).json({ message: "Invalid driver ID" });

    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [parsedId]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Driver not found" });

    res.status(200).json({ driver: result.rows[0] });
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Failed to fetch driver" });
  }
});

/* ----------------------- UPDATE DRIVER ----------------------- */
router.put("/drivers/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  let { name, phone, email, license_number, availability, description, price_per_day } = req.body;

  price_per_day =
    price_per_day === "" || price_per_day === "null" ? null : Number(price_per_day);

  if (price_per_day !== null && isNaN(price_per_day)) {
    return res.status(400).json({ message: "price_per_day must be a number or null" });
  }

  try {
    const existing = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
    if (existing.rowCount === 0) return res.status(404).json({ message: "Driver not found" });

    const current = existing.rows[0];

    const updatedName = name || current.name;
    const updatedPhone = phone || current.phone;
    const updatedEmail = email || current.email;
    const updatedLicense = license_number || current.license_number;
    const updatedAvailability =
      typeof availability !== "undefined" ? availability : current.availability;
    const updatedDescription = description || current.description;
    const updatedImage = req.file ? req.file.filename : current.image;
    const updatedPrice = price_per_day !== undefined ? price_per_day : current.price_per_day;

    const result = await pool.query(
      `UPDATE drivers 
       SET name = $1, phone = $2, email = $3, license_number = $4, image = $5, availability = $6, description = $7, price_per_day = $8
       WHERE id = $9 RETURNING *`,
      [
        updatedName,
        updatedPhone,
        updatedEmail,
        updatedLicense,
        updatedImage,
        updatedAvailability,
        updatedDescription,
        updatedPrice,
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

    if (result.rowCount === 0) return res.status(404).json({ message: "Driver not found" });

    res.status(200).json({
      message: "Driver availability updated",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ----------------------- DELETE DRIVER ----------------------- */
router.delete("/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM drivers WHERE id = $1 RETURNING *", [id]);

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
