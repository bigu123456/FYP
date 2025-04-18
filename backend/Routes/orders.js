const express = require("express");
const router = express.Router();
const pool = require("../db/Connection");
const { sendBookingConfirmation } = require("../controllers/otpController");

// Create a new order with vehicle booking limit check
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

    if (!vehicle_id || !user_id || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1. Check booking count for this vehicle
    const bookingLimit = 10;
    const bookingCountResult = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE vehicle_id = $1",
      [vehicle_id]
    );

    const currentBookings = parseInt(bookingCountResult.rows[0].count, 10);
    if (currentBookings >= bookingLimit) {
      return res.status(400).json({ success: false, message: "This vehicle is fully booked (limit reached)." });
    }

    // 2. Fetch user email
    const userCheck = await pool.query("SELECT id, email FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const userEmail = userCheck.rows[0].email;

    // 3. Get vehicle data
    const vehicleQuery = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    const vehicle = vehicleQuery.rows[0];

    // 4. Get driver data if provided
    let driver = {};
    if (driver_id) {
      const driverQuery = await pool.query("SELECT * FROM drivers WHERE id = $1", [driver_id]);
      if (driverQuery.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Driver not found" });
      }
      driver = driverQuery.rows[0];
    }

    // 5. Insert order
    const result = await pool.query(`
      INSERT INTO orders (
        vehicle_id, user_id, driver_id, rental_price,
        pickup_location, dropoff_location, pickup_time, dropoff_time,
        vehicle_brand, vehicle_model, vehicle_category, vehicle_fuel_type, vehicle_image,
        driver_name, driver_phone, driver_license, driver_image,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
              $9,$10,$11,$12,$13,
              $14,$15,$16,$17,
              NOW())
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

    const createdOrder = result.rows[0];

    // 6. Send confirmation email
    if (userEmail) {
      await sendBookingConfirmation(userEmail, {
        vehicle_brand: vehicle.brand,
        vehicle_model: vehicle.model,
        pickup_location,
        pickup_time,
        dropoff_location,
        dropoff_time,
        rental_price
      });
    }

    res.status(201).json({ success: true, order: createdOrder });

  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get all orders for a specific user
router.get("/orders/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({ success: true, orders: result.rows });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
