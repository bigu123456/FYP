const pool = require("../db/Connection");

<<<<<<< HEAD
const updateAvailability = async () => {
  try {
    // 1. Get vehicle_ids where the dropoff_time is in the past
    const expiredVehicleOrders = await pool.query(`
=======
const updateVehicleAvailability = async () => {
  console.log("Running availability update check...");

  try {
    // Find vehicles whose orders have ended
    const expiredOrders = await pool.query(`
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
      SELECT DISTINCT vehicle_id
      FROM orders
      WHERE dropoff_time < NOW()
    `);
<<<<<<< HEAD

    const vehicleIds = expiredVehicleOrders.rows.map(order => order.vehicle_id);

=======
    
    const vehicleIds = expiredOrders.rows.map(order => order.vehicle_id);

    // Update vehicle availability if there are any expired orders
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
    if (vehicleIds.length > 0) {
      await pool.query(
        `UPDATE vehicles SET is_available = true WHERE id = ANY($1::int[])`,
        [vehicleIds]
      );
<<<<<<< HEAD
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

=======
      console.log("Updated availability for vehicles:", vehicleIds);
    } else {
      console.log("No expired bookings found.");
    }
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
  } catch (error) {
    console.error("Error updating availability:", error.message);
  }
};

<<<<<<< HEAD
// Run every 1 minute
setInterval(updateAvailability, 60 * 1000);
=======
// Run once, after 1 minute (for example)
setInterval(updateVehicleAvailability, 60 * 1000);  // 60 seconds
>>>>>>> 11994a839c9610f18e58ba2e77ba621b379f2522
