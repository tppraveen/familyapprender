const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();

const dataRoutes = require('./routes/dataRoutes');
const handleError = require('./utils/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public/App')));

const nodeApiVersion = "/oData/v1";
app.use(nodeApiVersion+'/api/data', dataRoutes);
 
app.get(nodeApiVersion+'/api/data/users',dataRoutes.getAppHomeMenuTiles);

app.get('/users', async (req, res) => {
  try {
  console.log('Running query...');
  const users = await sql`SELECT * FROM users`;
  console.log('Users fetched:', users);
  res.json(users);
} catch (err) {
  console.error('Error fetching users:', err);
  res.status(500).json({ error: 'Failed to fetch users' });
}
});


router.get('/dbconnectsuccess', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    console.error('DB connection test failed:', error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
