// authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/Connection"); 

// Register a new user
const registerUser = async (req, res) => {
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
};

// Login a user
const loginUser = async (req, res) => {
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
      "jwt_secret_key",  // Store securely in env variable
      { expiresIn: "7days" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser };
