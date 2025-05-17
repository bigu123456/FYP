const pool = require("../db/Connection");

const updateAvailability = async () => {
  try {
    // 1. Get vehicle_ids where the dropoff_time is in the past
    const expiredVehicleOrders = await pool.query(`
      SELECT DISTINCT vehicle_id
      FROM orders
      WHERE dropoff_time < NOW()
    `);

    const vehicleIds = expiredVehicleOrders.rows.map(order => order.vehicle_id);

    if (vehicleIds.length > 0) {
      await pool.query(
        `UPDATE vehicles SET is_available = true WHERE id = ANY($1::int[])`,
        [vehicleIds]
      );
      console.log(`Updated ${vehicleIds.length} vehicle(s) to available.`);
    } else {
      console.log("No expired vehicle bookings found.");
    }

    // 2. Get driver_ids where the dropoff_time is in the past
    const expiredDriverOrders = await pool.query(`
      SELECT DISTINCT driver_id
      FROM orders
      WHERE dropoff_time < NOW() AND driver_id IS NOT NULL
    `);

    const driverIds = expiredDriverOrders.rows.map(order => order.driver_id);

    if (driverIds.length > 0) {
      await pool.query(
        `UPDATE drivers SET availability  = true WHERE id = ANY($1::int[])`,
        [driverIds]
      );
      
    } else {
      console.log("No expired driver bookings found.");
    }

  } catch (error) {
    console.error("Error updating availability:", error.message);
  }
};

// Run every 1 minute
setInterval(updateAvailability, 60 * 1000);
