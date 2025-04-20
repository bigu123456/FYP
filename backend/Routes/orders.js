const express = require("express");
const router = express.Router();
const pool = require("../db/Connection");
const { sendConfirmation, sendDriverNotification } = require("../controllers/otpController");

router.post("/orders", async (req, res) => {
  try {
    const {
      vehicle_id, user_id, driver_id, rental_price,
      pickup_location, dropoff_location, pickup_time, dropoff_time
    } = req.body;

    if (!vehicle_id || !user_id || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const bookingLimit = 10;
    const bookingCountResult = await pool.query("SELECT COUNT(*) FROM orders WHERE vehicle_id = $1", [vehicle_id]);
    if (parseInt(bookingCountResult.rows[0].count) >= bookingLimit) {
      return res.status(400).json({ success: false, message: "This vehicle is fully booked (limit reached)." });
    }

    const userCheck = await pool.query("SELECT id, email, name FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    const vehicleQuery = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleQuery.rows.length === 0) return res.status(404).json({ success: false, message: "Vehicle not found" });

    let driver = {};
    if (driver_id) {
      const driverQuery = await pool.query("SELECT * FROM drivers WHERE id = $1", [driver_id]);
      if (driverQuery.rows.length === 0) return res.status(404).json({ success: false, message: "Driver not found" });
      driver = driverQuery.rows[0];
    }

    const vehicle = vehicleQuery.rows[0];
    const user = userCheck.rows[0];

    const result = await pool.query(`
      INSERT INTO orders (
        vehicle_id, user_id, driver_id, rental_price,
        pickup_location, dropoff_location, pickup_time, dropoff_time,
        vehicle_brand, vehicle_model, vehicle_category, vehicle_fuel_type, vehicle_image,
        driver_name, driver_license, driver_image,
        created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,
              $9,$10,$11,$12,$13,
              $14,$15,$16,
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
      driver.license_number || null,
      driver.image || null
    ]);

    const createdOrder = result.rows[0];

    await sendConfirmation(user.email, {
      vehicle_brand: vehicle.brand,
      vehicle_model: vehicle.model,
      pickup_location,
      pickup_time,
      dropoff_location,
      dropoff_time,
      rental_price,
      driver_name: driver.name,
      driver_license: driver.license_number
    });

    if (driver.email) {
      await sendDriverNotification(driver.email, {
        driver_name: driver.name,
        pickup_location,
        pickup_time,
        dropoff_location,
        dropoff_time,
        vehicle_brand: vehicle.brand,
        vehicle_model: vehicle.model
      }, user);
    }

    res.status(201).json({ success: true, order: createdOrder });

  } catch (error) {
    console.error("❌ Error creating order:", error.message, error.stack);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/orders/user/:userId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [req.params.userId]);
    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error("Error fetching user orders:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM orders");
    res.json({ success: true, message: "All orders deleted" });
  } catch (err) {
    console.error("Error deleting orders:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete orders" });
  }
});

module.exports = router;
