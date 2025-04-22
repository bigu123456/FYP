const express = require("express");
const router = express.Router();
const pool = require("../db/Connection");
const { sendConfirmation, sendDriverNotification } = require("../controllers/otpController");
const { updateLoyaltyPoints } = require("./loyalty");

// 🚗 CREATE A NEW ORDER
router.post("/orders", async (req, res) => {
  try {
    const {
      vehicle_id, user_id, driver_id, rental_price,
      pickup_location, dropoff_location, pickup_time, dropoff_time
    } = req.body;

    // ✅ Basic validations
    if (!vehicle_id || !user_id || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Optional: Prevent overlapping bookings (instead of just count)
    const overlappingCheck = await pool.query(
      `SELECT * FROM orders
       WHERE vehicle_id = $1 AND NOT (dropoff_time <= $2 OR pickup_time >= $3)`,
      [vehicle_id, pickup_time, dropoff_time]
    );
    if (overlappingCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Vehicle is already booked for selected time." });
    }

    // ✅ User and Vehicle Lookup
    const userCheck = await pool.query("SELECT id, email, name FROM users WHERE id = $1", [user_id]);
    if (userCheck.rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    const vehicleQuery = await pool.query("SELECT * FROM vehicles WHERE id = $1", [vehicle_id]);
    if (vehicleQuery.rows.length === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    let driver = {};
    if (driver_id) {
      const driverQuery = await pool.query("SELECT * FROM drivers WHERE id = $1", [driver_id]);
      if (driverQuery.rows.length === 0)
        return res.status(404).json({ success: false, message: "Driver not found" });
      driver = driverQuery.rows[0];
    }

    const vehicle = vehicleQuery.rows[0];
    const user = userCheck.rows[0];

    // ⭐ Loyalty Discount Logic
    const loyaltyQuery = await pool.query("SELECT level FROM loyalty WHERE user_id = $1", [user_id]);
    const loyaltyLevel = loyaltyQuery.rows[0]?.level?.trim() || "Bronze";

    let discountPercent = 0;
    if (loyaltyLevel === "Silver") discountPercent = 5;
    else if (loyaltyLevel === "Gold") discountPercent = 10;
    else if (loyaltyLevel === "Platinum") discountPercent = 15;

    const discountedPrice = parseFloat((rental_price - (rental_price * discountPercent / 100)).toFixed(2));

    // 📝 Insert order into database
    const result = await pool.query(`
      INSERT INTO orders (
        vehicle_id, user_id, driver_id,
        original_price, rental_price,
        pickup_location, dropoff_location, pickup_time, dropoff_time,
        vehicle_brand, vehicle_model, vehicle_category, vehicle_fuel_type, vehicle_image,
        driver_name, driver_license, driver_image, driver_phone,
        created_at
      )
      VALUES (
        $1, $2, $3,
        $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14,
        $15, $16, $17, $18,
        NOW()
      )
      RETURNING *;
    `, [
      vehicle_id,
      user_id,
      driver_id || null,
      rental_price, // original price
      discountedPrice,
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
      driver.image || null,
      driver.phone || null
    ]);

    const createdOrder = result.rows[0];

    // 🏆 Update loyalty points
    await updateLoyaltyPoints(user_id, rental_price, pickup_time, dropoff_time);

    // 📧 Send confirmation email to user
    await sendConfirmation(user.email, {
      vehicle_brand: vehicle.brand,
      vehicle_model: vehicle.model,
      pickup_location,
      pickup_time,
      dropoff_location,
      dropoff_time,
      rental_price: discountedPrice,
      driver_name: driver.name,
      driver_license: driver.license_number,
      loyalty_level: loyaltyLevel,
      discount: discountPercent
    });

    // Notify driver
    if (driver.email) {
      await sendDriverNotification(driver.email, {
        driver_name: driver.name,
        driver_phone: driver.phone,
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
// 📦 GET ALL ORDERS FOR A USER (with full vehicle & driver details + discount info)
router.get("/orders/user/:userId", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        d.name AS driver_name,
        d.phone AS driver_phone,
        d.license_number AS driver_license,
        d.image AS driver_image,
        v.brand AS vehicle_brand,
        v.model AS vehicle_model,
        v.category AS vehicle_category,
        v.fuel_type AS vehicle_fuel_type,
        v.image_url AS vehicle_image,
        ROUND(((o.original_price - o.rental_price) / o.original_price) * 100, 2) AS discount_applied,
        ROUND((o.original_price - o.rental_price), 2) AS discount_amount
      FROM orders o
      LEFT JOIN drivers d ON o.driver_id = d.id
      LEFT JOIN vehicles v ON o.vehicle_id = v.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [req.params.userId]);

    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


//  DELETE A SPECIFIC ORDER BY ID
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query("DELETE FROM orders WHERE order_id = $1 RETURNING *", [orderId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted", deletedOrder: result.rows[0] });
  } catch (err) {
    console.error("❌ Error deleting order:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});


module.exports = router;