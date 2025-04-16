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

    // Insert order with full details — REMOVED the non-existent "image" column
    const result = await pool.query(`
      INSERT INTO orders (
        vehicle_id, user_id, driver_id, rental_price,
        pickup_location, dropoff_location, pickup_time, dropoff_time,
        vehicle_brand, vehicle_model, vehicle_category, vehicle_fuel_type, vehicle_image,
        driver_name, driver_phone, driver_license, driver_image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
              $9,$10,$11,$12,$13,
              $14,$15,$16,$17)
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

    const result = await pool.query(`
      SELECT orders.*, vehicles.image_url as vehicle_image
      FROM orders
      JOIN vehicles ON orders.vehicle_id = vehicles.id
    `);

    const orders = result.rows.map(order => ({
      ...order,
      vehicle_image: order.vehicle_image ? `http://localhost:5000${order.vehicle_image}` : null
    }));

    console.log("Orders fetched:", orders);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Failed to load orders" });
  }
});

// GET orders for a specific user
router.get("/orders/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT orders.*, 
             vehicles.image_url AS vehicle_image,
             drivers.name AS driver_name,
             drivers.phone AS driver_phone,
             drivers.license_number AS driver_license,
             drivers.image AS driver_image
      FROM orders
      LEFT JOIN vehicles ON orders.vehicle_id = vehicles.id
      LEFT JOIN drivers ON orders.driver_id = drivers.id
      WHERE orders.user_id = $1
      ORDER BY orders.pickup_time DESC
    `, [userId]);

    res.json({ success: true, orders: result.rows });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order history" });
  }
});

module.exports = router;
