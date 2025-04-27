const express = require('express');
const router = express.Router();
const pool = require('../db/Connection');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique file names
  }
});

const upload = multer({ storage });

// Route to update user profile
router.put('/user/:userId/update-profile', upload.single('profile_image'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, age, city, contact_number } = req.body;

    let profile_image = null;
    if (req.file) {
      profile_image = req.file.path; // Save the path of the uploaded file
    }

    const query = `
      UPDATE users
      SET name = $1, email = $2, age = $3, city = $4, contact_number = $5, profile_image = $6
      WHERE id = $7 RETURNING *;
    `;
    const values = [name, email, age, city, contact_number, profile_image, userId];
    
    const { rows } = await pool.query(query, values);
    res.status(200).json(rows[0]); // Return the updated user data
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating profile.' });
  }
});

module.exports = router;
