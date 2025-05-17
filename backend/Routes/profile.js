const express = require('express');
const router = express.Router();
const pool = require('../db/Connection');
const bcrypt = require('bcryptjs'); // Add this for password hashing

// Route to update user profile
router.put('/user/:userId/update-profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, age, city, contact_number, password } = req.body;

    // If password is provided, hash it
    let passwordHash = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    let query = `
      UPDATE users
      SET name = $1, email = $2, age = $3, city = $4, contact_number = $5
      ${passwordHash ? `, password = $6` : ''}
      WHERE id = ${passwordHash ? '$7' : '$6'}
      RETURNING id, name, email, age, city, contact_number;
    `;

    const values = passwordHash
      ? [name, email, age, city, contact_number, passwordHash, userId]
      : [name, email, age, city, contact_number, userId];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(rows[0]); // Return updated user (without password)
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Error updating profile.' });
  }
});

// Route to get user by ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT id, name, email, age, city, contact_number
      FROM users
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;
