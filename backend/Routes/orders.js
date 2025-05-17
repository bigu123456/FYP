const express = require("express");
const router = express.Router();
const pool = require("../db/Connection");
const { sendConfirmation, sendDriverNotification } = require("../controllers/otpController");
const { updateLoyaltyPoints } = require("./loyalty");
<<<<<<< HEAD
router.post("/orders", async (req, res) => {
  try {
    const {
      vehicle_id, user_id, driver_id, rental_price, original_price,
      pickup_location, dropoff_location, pickup_time, dropoff_time
    } = req.body;

    if (!vehicle_id || !user_id || !original_price || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
=======

// CREATE A NEW ORDER
router.post("/orders", async (req, res) => {
  try {
    const {
      vehicle_id, user_id, driver_id, rental_price,
      pickup_location, dropoff_location, pickup_time, dropoff_time
    } = req.body;

    if (!vehicle_id || !user_id || !rental_price || !pickup_location || !dropoff_location || !pickup_time || !dropoff_time) {
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const concurrentBookings = await pool.query(
      `SELECT COUNT(*) FROM orders
       WHERE vehicle_id = $1 AND NOT (dropoff_time <= $2 OR pickup_time >= $3)`,
      [vehicle_id, pickup_time, dropoff_time]
    );

<<<<<<< HEAD
    const vehicleStatus = await pool.query(
      `SELECT is_available FROM vehicles WHERE id = $1`,
      [vehicle_id]
    );

    if (!vehicleStatus.rows[0]?.is_available) {
      return res.status(400).json({ success: false, message: "Vehicle is currently unavailable." });
=======
    if (parseInt(concurrentBookings.rows[0].count) >= 10) {
      return res.status(400).json({ success: false, message: "Vehicle is fully booked for selected time." });
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    }

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

<<<<<<< HEAD
    // Loyalty discount logic is only for logging, not saving
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    const loyaltyQuery = await pool.query("SELECT level FROM loyalty WHERE user_id = $1", [user_id]);
    const loyaltyLevel = loyaltyQuery.rows[0]?.level?.trim() || "Bronze";

    let discountPercent = 0;
    if (loyaltyLevel === "Silver") discountPercent = 5;
    else if (loyaltyLevel === "Gold") discountPercent = 10;
    else if (loyaltyLevel === "Platinum") discountPercent = 15;

<<<<<<< HEAD
    const discountAmount = parseFloat((rental_price * discountPercent / 100).toFixed(2));
    const discountedPrice = parseFloat((rental_price - discountAmount).toFixed(2));

    
=======
    const discountedPrice = parseFloat((rental_price - (rental_price * discountPercent / 100)).toFixed(2));
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

    const result = await pool.query(`
      INSERT INTO orders (
        vehicle_id, user_id, driver_id,
        vehicle_price, driver_price,
        original_price, rental_price,
        pickup_location, dropoff_location, pickup_time, dropoff_time,
        vehicle_brand, vehicle_model, vehicle_category, vehicle_fuel_type, vehicle_image,
        driver_name, driver_license, driver_image, driver_phone,
<<<<<<< HEAD
        vehicle_description, driver_description,
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
        created_at
      )
      VALUES (
        $1, $2, $3,
        $4, $5,
        $6, $7,
        $8, $9, $10, $11,
        $12, $13, $14, $15, $16,
        $17, $18, $19, $20,
<<<<<<< HEAD
        $21, $22,
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
        NOW()
      )
      RETURNING *;
    `, [
      vehicle_id,
      user_id,
      driver_id || null,
      vehicle.price,
<<<<<<< HEAD
      driver.price,
      original_price,
      rental_price, // ← store without discount
=======
      driver.price || 0,
      rental_price,
      discountedPrice,
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
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
<<<<<<< HEAD
      driver.phone || null,
      vehicle.description || null,
      driver.description || null
    ]);

    const createdOrder = result.rows[0];

    await pool.query(
      `UPDATE vehicles SET is_available = false WHERE id = $1`,
      [vehicle_id]
    );
=======
      driver.phone || null
    ]);

    const createdOrder = result.rows[0];
    await pool.query(
      `UPDATE vehicles
       SET is_available = false
       WHERE id = $1`,
      [vehicle_id]
    );
    
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522

    await updateLoyaltyPoints(user_id, rental_price, pickup_time, dropoff_time);

    await sendConfirmation(user.email, {
      vehicle_brand: vehicle.brand,
      vehicle_model: vehicle.model,
      pickup_location,
      pickup_time,
      dropoff_location,
      dropoff_time,
<<<<<<< HEAD
      rental_price, // original value
=======
      rental_price: discountedPrice,
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      driver_name: driver.name,
      driver_license: driver.license_number,
      loyalty_level: loyaltyLevel,
      discount: discountPercent
    });

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
<<<<<<< HEAD
    console.error("Error creating order:", error.message, error.stack);
=======
    console.error(" Error creating order:", error.message, error.stack);
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    res.status(500).json({ success: false, message: "Server error" });
  }
});

<<<<<<< HEAD

=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
// GET ALL ORDERS FOR A USER
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
        ROUND(
          CASE 
            WHEN o.original_price = 0 THEN 0
            ELSE ((o.original_price - o.rental_price) / o.original_price) * 100
          END, 2
        ) AS discount_applied,
        ROUND((o.original_price - o.rental_price), 2) AS discount_amount
      FROM orders o
      LEFT JOIN drivers d ON o.driver_id = d.id
      LEFT JOIN vehicles v ON o.vehicle_id = v.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [req.params.userId]);

    res.json({ success: true, orders: result.rows });
  } catch (err) {
<<<<<<< HEAD
    console.error("Error fetching user orders:", err.message);
=======
    console.error(" Error fetching user orders:", err.message);
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    res.status(500).json({ success: false, message: "Server error" });
  }
});

<<<<<<< HEAD
// GET ALL ORDERS (ADMIN)
=======
// GET ALL ORDERS
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
router.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.order_id,
        o.user_id,
        o.vehicle_id,
        o.driver_id,
        o.pickup_location,
        o.dropoff_location,
        o.pickup_time,
        o.dropoff_time,
        o.original_price,
        o.rental_price,
        o.created_at,
<<<<<<< HEAD
        u.name AS user_name,
        u.email AS user_email,
        u.contact_number AS user_contact,
        u.city AS user_city,
        u.age AS user_age,
        u.role AS user_role,
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
        d.name AS driver_name,
        d.phone AS driver_phone,
        d.license_number AS driver_license,
        d.image AS driver_image,
        v.brand AS vehicle_brand,
        v.model AS vehicle_model,
        v.category AS vehicle_category,
        v.fuel_type AS vehicle_fuel_type,
        v.image_url AS vehicle_image,
        ROUND(
          CASE 
            WHEN o.original_price = 0 THEN 0
            ELSE ((o.original_price - o.rental_price) / o.original_price) * 100
          END, 2
        ) AS discount_applied,
        ROUND((o.original_price - o.rental_price), 2) AS discount_amount
      FROM orders o
      LEFT JOIN drivers d ON o.driver_id = d.id
      LEFT JOIN vehicles v ON o.vehicle_id = v.id
<<<<<<< HEAD
      LEFT JOIN users u ON o.user_id = u.id
=======
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      ORDER BY o.created_at DESC
    `);

    res.json({ success: true, orders: result.rows });
  } catch (err) {
    console.error("Error fetching all orders:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

<<<<<<< HEAD
=======
// DELETE ORDER
router.delete("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query("DELETE FROM orders WHERE order_id = $1 RETURNING *", [orderId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted", deletedOrder: result.rows[0] });
  } catch (err) {
    console.error(" Error deleting order:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});

>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
module.exports = router;
