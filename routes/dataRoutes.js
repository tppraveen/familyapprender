const express = require('express');
const router = express.Router();
const sql = require('../db'); // CommonJS import

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
