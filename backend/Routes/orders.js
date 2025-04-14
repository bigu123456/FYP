const express = require("express");
const router = express.Router();
const pool = require("../db/Connection");

// POST endpoint to create an order with full vehicle and driver info
router.post("/orders", async (req, res) => {
  try {
    const { 
      vehicle_id, 
      user_id, 
      driver_id, 
      rental_price, 
      pickup_location, 
      dropoff_location, 
      pickup_time, 
      dropoff_time 
    } = req.body;

    // Validate input
    if (!vehicle_id || !user_id || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check user
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get vehicle details
    const vehicleQuery = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    const vehicle = vehicleQuery.rows[0];

    // Get driver details (optional)
    let driver = {};
    if (driver_id) {
      const driverQuery = await pool.query("SELECT * FROM drivers WHERE id = $1", [driver_id]);
      if (driverQuery.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Driver not found" });
      }
      driver = driverQuery.rows[0];
    }

    // Insert order with full details
    const result = await pool.query(`
      INSERT INTO orders (
        vehicle_id, user_id, driver_id, rental_price,
        pickup_location, dropoff_location, pickup_time, dropoff_time, image,
        vehicle_brand, vehicle_model, vehicle_category, vehicle_fuel_type, vehicle_image,
        driver_name, driver_phone, driver_license, driver_image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,
              $10,$11,$12,$13,$14,
              $15,$16,$17,$18)
      RETURNING *;
    `, [
      vehicle_id,
      user_id,
      driver_id || null,
      rental_price,
      pickup_location,
      dropoff_location,
      pickup_time,
      dropoff_time,
      vehicle.image_url, // existing image field
      vehicle.brand,
      vehicle.model,
      vehicle.category,
      vehicle.fuel_type,
      vehicle.image_url,
      driver.name || null,
      driver.phone || null,
      driver.license_number || null,
      driver.image || null
    ]);

    res.status(201).json({ success: true, order: result.rows[0] });

  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// GET all orders with vehicle images
router.get("/orders", async (req, res) => {
  try {
    console.log("Fetching all orders with images...");

    // Use the correct column name "image_url" from vehicles and alias it as vehicle_image
    const result = await pool.query(`
      SELECT orders.*, vehicles.image_url as vehicle_image
      FROM orders
      JOIN vehicles ON orders.vehicle_id = vehicles.id
    `);
    

    // Map each order's image to a full URL.
    const orders = result.rows.map(order => ({
      ...order,
      //  stored image URL is relative (e.g. '/uploads/1742703596709.png'), prepend the backend base URL.
      vehicle_image: order.vehicle_image ? `http://localhost:5000${order.vehicle_image}` : null
    }));

    console.log("Orders fetched:", orders);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Failed to load orders" });
  }
});

module.exports = router;
