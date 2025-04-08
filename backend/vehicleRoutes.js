const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("./db/Connection");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Images will be stored in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename
  },
});
const upload = multer({ storage });

// Add a new vehicle with image upload
router.post("/vehicles", upload.single("image"), async (req, res) => {
  const { brand, model, category, type, fuel_type, rental_price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Correct URL format

  try {
    const newVehicle = await pool.query(
      "INSERT INTO vehicles (brand, model, category, type, fuel_type, rental_price, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [brand, model, category, type, fuel_type, rental_price, imageUrl]
    );
    res.status(201).json({ success: true, vehicle: newVehicle.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//  Get all vehicles
router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await pool.query("SELECT * FROM vehicles");
    res.json(vehicles.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Delete a vehicle by ID
router.delete("/vehicles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteVehicle = await pool.query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [id]);

    if (deleteVehicle.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ message: "Vehicle deleted successfully", deletedVehicle: deleteVehicle.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
