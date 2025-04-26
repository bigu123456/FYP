const express = require("express");
const multer = require("multer");
const pool = require("../db/Connection");
const router = express.Router();
const path = require("path");

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

// POST request to save a vehicle listing request
router.post("/", upload.single("photo"), async (req, res) => {
  const {
    name,
    phone,
    message,
    vehicleType,
    brand,
    model,
    numberPlate,
    category,
    fuelType,
    transmission,
    seats,
    price,
    description,
  } = req.body;

  const photo = req.file ? req.file.filename : null;

  try {
    await pool.query(
      `INSERT INTO vehicle_requests (
        name, phone, message, vehicle_type, brand, model, number_plate,
        category, fuel_type, transmission, seats, price, description, photo
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        name,
        phone,
        message,
        vehicleType,
        brand,
        model,
        numberPlate,
        category,
        fuelType,
        transmission,
        seats,
        price,
        description,
        photo,
      ]
    );

    res.status(201).json({ message: "Request submitted successfully." });
  } catch (err) {
    console.error("Error saving vehicle request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET request to fetch all requests
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicle_requests ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching vehicle requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
