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
    const users = await sql`SELECT * FROM users`;
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
