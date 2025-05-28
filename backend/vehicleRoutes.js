const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("./db/Connection");

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Add a new vehicle
router.post("/vehicles", upload.single("image"), async (req, res) => {
  const { brand, model, category, type, fuel_type, rental_price, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newVehicle = await pool.query(
      "INSERT INTO vehicles (brand, model, category, type, fuel_type, rental_price, description, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [brand, model, category, type, fuel_type, rental_price, description, imageUrl]
    );
    res.status(201).json({ success: true, vehicle: newVehicle.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all vehicles with availability
router.get("/vehicles", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.*, 
        CASE 
          WHEN v.is_available = false THEN false
          ELSE true
        END AS availability
      FROM vehicles v
      LEFT JOIN orders o ON o.vehicle_id = v.id
      GROUP BY v.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching vehicles:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a vehicle
router.put("/vehicles/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const {
    brand,
    model,
    category,
    type,
    fuel_type,
    rental_price,
    description,
    availability,
  } = req.body;

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const fields = [
      brand,
      model,
      category,
      type,
      fuel_type,
      rental_price,
      description,
      availability === "false" ? false : true,
    ];

    let query = `
      UPDATE vehicles SET
        brand = $1,
        model = $2,
        category = $3,
        type = $4,
        fuel_type = $5,
        rental_price = $6,
        description = $7,
        availability = $8`;

    if (imageUrl) {
      fields.push(imageUrl, id); // index 9, 10
      query += `, image_url = $9 WHERE id = $10 RETURNING *`;
    } else {
      fields.push(id); // index 9
      query += ` WHERE id = $9 RETURNING *`;
    }

    const result = await pool.query(query, fields);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.json({ success: true, vehicle: result.rows[0] });
  } catch (err) {
    console.error("Error updating vehicle:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get vehicle by ID
router.get("/vehicles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching vehicle by ID:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete vehicle
router.delete("/vehicles/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Error deleting vehicle:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
