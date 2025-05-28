// authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/Connection"); 

const registerUser = async (req, res) => {
  const { name, email, password, contact_number, city, age } = req.body;

  try {
    // Check if email exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if contact number exists
    const numberCheck = await pool.query("SELECT * FROM users WHERE contact_number = $1", [contact_number]);

    if (numberCheck.rows.length > 0) {
      return res.status(400).json({ message: "Contact number already exists" });
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
   

    const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET_KEY,
  {expiresIn :"1h"}
  
);

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser };
