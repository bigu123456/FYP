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

// Add a new vehicle with image upload and description
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

router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await pool.query(`
      SELECT 
        v.*, 
        CASE 
          WHEN COUNT(o.vehicle_id) >= 10 THEN false
          ELSE true
        END AS availability
      FROM vehicles v
      LEFT JOIN orders o ON o.vehicle_id = v.id
      GROUP BY v.id
    `);

    res.json(Array.isArray(vehicles.rows) ? vehicles.rows : []);
  } catch (err) {
    console.error("Error fetching vehicles:", err.message);
    res.json([]);
  }
});



// Delete a vehicle
router.delete("/vehicles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orderCheck = await pool.query("SELECT * FROM orders WHERE vehicle_id = $1", [id]);
    if (orderCheck.rows.length > 0) {
      return res.status(400).json({
        message: "This vehicle cannot be deleted because it is associated with one or more orders."
      });
    }
    const deleteVehicle = await pool.query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [id]);
    if (deleteVehicle.rows.length === 0) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully", deletedVehicle: deleteVehicle.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a vehicle (with optional image)
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
  } = req.body;

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Build the base query dynamically depending on image presence
    const fields = [brand, model, category, type, fuel_type, rental_price, description];
    let query = `
      UPDATE vehicles SET
        brand = $1,
        model = $2,
        category = $3,
        type = $4,
        fuel_type = $5,
        rental_price = $6,
        description = $7`;

    if (imageUrl) {
      fields.push(imageUrl, id); // index 8, 9
      query += `, image_url = $8 WHERE id = $9 RETURNING *`;
    } else {
      fields.push(id); // index 8
      query += ` WHERE id = $8 RETURNING *`;
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


module.exports = router;
