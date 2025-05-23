const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // add ssl if needed, e.g. ssl: { rejectUnauthorized: false }
});

async function testDBConnection() {
  try {
    // Run a simple query to test connection
    const res = await pool.query('SELECT NOW()');
    console.log('DB Connection successful:', res.rows[0]);
  } catch (err) {
    console.error('DB Connection failed:', err);
  }
}

// Call the test function on startup
testDBConnection();

module.exports = pool;
