const express = require("express");
const router = express.Router();
const pool = require("../db/Connection");

// 📌 POST endpoint to create an order
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

    console.log("Received order request:", req.body);

    // 📌 Validate required fields
    if (!vehicle_id || !user_id || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 📌 Check if the user exists
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 📌 Check if the vehicle exists
    const vehicleCheck = await pool.query("SELECT id, image_url FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    // Use the image_url from the vehicles table
    const vehicleImage = vehicleCheck.rows[0].image_url;

    // 📌 Insert order into the orders table (store the vehicle image URL)
    const result = await pool.query(
      "INSERT INTO orders (vehicle_id, user_id, driver_id, rental_price, pickup_location, dropoff_location, pickup_time, dropoff_time, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        vehicle_id, 
        user_id, 
        driver_id || null, 
        rental_price, 
        pickup_location, 
        dropoff_location, 
        pickup_time, 
        dropoff_time,
        vehicleImage
      ]
    );

    console.log("Order created:", result.rows[0]);
    res.status(201).json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error("Error saving order:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 GET all orders with vehicle images
router.get("/orders", async (req, res) => {
  try {
    console.log("Fetching all orders with images...");

    // Use the correct column name "image_url" from vehicles and alias it as vehicle_image
    const result = await pool.query(`
      SELECT o.*, v.image_url as vehicle_image
      FROM orders o
      JOIN vehicles v ON o.vehicle_id = v.id
    `);

    // Map each order's image to a full URL.
    const orders = result.rows.map(order => ({
      ...order,
      // If your stored image URL is relative (e.g. '/uploads/1742703596709.png'), prepend the backend base URL.
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
