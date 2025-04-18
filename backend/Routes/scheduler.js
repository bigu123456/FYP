const cron = require("node-cron");
const pool = require("../db/Connection");

// This runs every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("Running availability update check...");

  try {
    // Find vehicles whose orders have ended
    const expiredOrders = await pool.query(`
      SELECT vehicle_id
      FROM orders
      WHERE dropoff_time < NOW()
    `);

    const vehicleIds = expiredOrders.rows.map(order => order.vehicle_id);

    // Update vehicle availability
    if (vehicleIds.length > 0) {
      await pool.query(
        `UPDATE vehicles SET availability = true WHERE id = ANY($1::int[])`,
        [vehicleIds]
      );
      console.log("Updated availability for vehicles:", vehicleIds);
    } else {
      console.log("No expired bookings found.");
    }
  } catch (error) {
    console.error("Error updating availability:", error.message);
  }
});
