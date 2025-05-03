const pool = require("../db/Connection");

const updateVehicleAvailability = async () => {
  console.log("Running availability update check...");

  try {
    // Find vehicles whose orders have ended
    const expiredOrders = await pool.query(`
      SELECT DISTINCT vehicle_id
      FROM orders
      WHERE dropoff_time < NOW()
    `);
    
    const vehicleIds = expiredOrders.rows.map(order => order.vehicle_id);

    // Update vehicle availability if there are any expired orders
    if (vehicleIds.length > 0) {
      await pool.query(
        `UPDATE vehicles SET is_available = true WHERE id = ANY($1::int[])`,
        [vehicleIds]
      );
      console.log("Updated availability for vehicles:", vehicleIds);
    } else {
      console.log("No expired bookings found.");
    }
  } catch (error) {
    console.error("Error updating availability:", error.message);
  }
};

// Run once, after 1 minute (for example)
setInterval(updateVehicleAvailability, 60 * 1000);  // 60 seconds
