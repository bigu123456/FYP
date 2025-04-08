// index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const vehicleRoutes = require("./vehicleRoutes");
const driverRoutes = require("./Routes/driverRoutes");
const ordersRoutes = require("./Routes/orders");
const authRoutes = require("./Routes/authRoutes");  // Import auth routes

const { verifyToken, isAdmin } = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register routes
app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);
app.use("/api", ordersRoutes);
app.use("/api/auth", authRoutes);  // Add the auth routes

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
