const express = require("express");
const pool = require("../db/Connection");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
<<<<<<< HEAD
    cb(null, "uploads/"); // Directory where images will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename for the image
=======
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  },
});

const upload = multer({ storage });

/* ----------------------- ADD DRIVER ----------------------- */
router.post("/drivers", upload.single("image"), async (req, res) => {
<<<<<<< HEAD
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

=======
  const { name, phone, email, license_number, description, price_per_day } = req.body;

  if (!name || !phone || !email || !license_number || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const imageFilename = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO drivers (name, phone, email, license_number, availability, image, description, price_per_day)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [name, phone, email, license_number, true, imageFilename, description, price_per_day]
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
  let { name, phone, email, license_number, availability, description, price_per_day } = req.body;

  // Convert price_per_day safely to number or null
  price_per_day =
    price_per_day === "" || price_per_day === "null" ? null : Number(price_per_day);

  if (price_per_day !== null && isNaN(price_per_day)) {
    return res.status(400).json({ message: "price_per_day must be a number or null" });
  }

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
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    res.status(200).json({ drivers: result.rows });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to load drivers" });
  }
});

<<<<<<< HEAD
/* ----------------------- GET A SINGLE DRIVER ----------------------- */
router.get("/drivers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [parsedId]);
=======
/* ----------------------- GET SINGLE DRIVER ----------------------- */
router.get("/drivers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [id]);
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ driver: result.rows[0] });
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Failed to fetch driver" });
  }
});

<<<<<<< HEAD
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

=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
module.exports = router;
