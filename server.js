 
const express = require('express');
const sql = require('./db');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const app = express();
const dataRoutes = require('./routes/dataRoutes');
const handleError = require('./utils/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/App')));
 
 

// GET all users

app.get('/users', async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
