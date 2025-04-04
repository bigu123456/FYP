const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const pool = require("./db/Connection"); // Ensure this file is correctly configured
const vehicleRoutes = require("./vehicleRoutes"); // Import vehicle routes
const driverRoutes = require("./Routes/driverRoutes");
const { verifyToken, isAdmin } = require("./middlewares/authMiddleware");
const ordersRoutes = require("./Routes/orders");  // Ensure this path is correct


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register vehicle and driver routes
app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);
app.use("/api", ordersRoutes);

// Register a new user
app.post("/api/register", async (req, res) => {
  const { name, email, password, contact_number, city, age } = req.body;

  try {
    // Check if email or contact number exists
    const existingUser = await pool.query(
      "SELECT email, contact_number FROM users WHERE email = $1 OR contact_number = $2",
      [email, contact_number]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email or contact number already exists" });
    }

    // Hash the password and insert new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, contact_number, city, age) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, hashedPassword, contact_number, city, age]
    );

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Add the role to the JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      "your_jwt_secret_key",  // Store securely in env variable
      { expiresIn: "7days" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server Error");
  }
});

// Endpoint to fetch all users (only accessible to admins)
app.get("/api/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, contact_number FROM users");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to update the role of a user (only accessible to admins)
app.put("/api/users/:userId/role", verifyToken, isAdmin, async (req, res) => {
  const { userId } = req.params;  // Get user ID from the URL
  const { role } = req.body;  // Get the new role from the request body

  try {
    // Check if the user exists
    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the role of the user
    const updateUserRole = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
      [role, userId]
    );

    if (updateUserRole.rows.length > 0) {
      res.status(200).json({ message: "Role updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update role" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
