// server.js (Main server file)

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const paymentRoutes=require("./Routes/payment.routes")
const vehicleRoutes = require("./vehicleRoutes");
const driverRoutes = require("./Routes/driverRoutes");
const ordersRoutes = require("./Routes/orders");
const authRoutes = require("./Routes/authRoutes");  // Import auth routes
const userRoutes = require("./Routes/users"); // Import user routes

const { verifyToken, isAdmin } = require("./middlewares/authMiddleware");
const profileRoutes = require('./Routes/profile'); // or './Routes/user'
const sheduler=require("./Routes/scheduler"); 
const { loyaltyRouter } = require("./Routes/loyalty");
const vehicleRequestsRoute = require("./Routes/vehicleRequests");
const transactionRoutes = require('./Routes/transactionRoutes');

const Routes = require("twilio/lib/rest/Routes");
const bigu =require("./Routes/bigu");
const feedbackRoutes = require("./Routes/feedback");









const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register routes
app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);
app.use("/api", ordersRoutes);
app.use("/api/auth", authRoutes);  // Add the auth routes
app.use("/api", userRoutes);  // Register the users route
app.use('/api', profileRoutes);
app.use("/api/loyalty", loyaltyRouter); //
app.use('/api/vehicle-requests', vehicleRequestsRoute);
// Define the route for fetching transactions
app.use('/api', transactionRoutes); 
app.get('/vehicles/usage');
app.use("/api", bigu);
app.use("/api/feedback", feedbackRoutes);


// Admin-only route example
app.use("/api/admin", verifyToken, isAdmin, (req, res) => {
  res.send("Welcome Admin!");
});



//payment routes
app.use("/api", paymentRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
