const express = require('express');
const router = express.Router();
const pool = require('../db/Connection');

router.put('/user/:id/update-profile', async (req, res) => {
  const { id } = req.params;
  const { name, email, age, city, contact_number } = req.body;

  try {
    await pool.query(
      `UPDATE users SET name=$1, email=$2, age=$3, city=$4, contact_number=$5 WHERE id=$6`,
      [name, email, age, city, contact_number, id]
    );

    res.status(200).json({ message: 'Profile updated without image' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
