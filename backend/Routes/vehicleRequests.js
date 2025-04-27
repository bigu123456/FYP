const express = require("express");
const multer = require("multer");
const pool = require("../db/Connection");
const router = express.Router();
const { sendVehicleRequestStatusUpdate } = require("./vehicleRequestMailer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST - Submit a vehicle request
router.post("/", upload.single("photo"), async (req, res) => {
  const {
    name,
    email,
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

  const photo = req.file ? req.file.path : null;

  try {
    await pool.query(
      `INSERT INTO vehicle_requests (
        name, email, message, vehicle_type, brand, model, number_plate, 
        category, fuel_type, transmission, seats, price, description, photo, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending')`,
      [
        name,
        email,
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

    res.json({ message: "Vehicle request submitted successfully!" });
  } catch (err) {
    console.error("Error submitting vehicle request:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT - Update request status (approve/reject)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update the request status
    await pool.query(
      "UPDATE vehicle_requests SET status = $1 WHERE id = $2",
      [status, id]
    );

    // Fetch updated request
    const requestResult = await pool.query(
      "SELECT * FROM vehicle_requests WHERE id = $1",
      [id]
    );
    const request = requestResult.rows[0];

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Send email notification
    if (request.email) {
      await sendVehicleRequestStatusUpdate(
        request.email,
        { brand: request.brand, model: request.model },
        status
      );
    }

    // If approved, insert into vehicles table
    if (status === "approved") {
      const rentalPrice = request.price || 0;

      await pool.query(
        `INSERT INTO vehicles (
          brand, model, category, type, fuel_type, rental_price, 
          availability, image_url, description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          request.brand,
          request.model,
          request.category,
          request.vehicle_type,
          request.fuel_type,
          rentalPrice,
          true, // available by default
          request.photo,
          request.description,
        ]
      );
    }

    res.json({ message: "Request status updated successfully." });
  } catch (err) {
    console.error("Error updating request status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch all vehicle requests
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicle_requests ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching vehicle requests:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch all approved vehicles
router.get("/vehicles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE availability = true ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
