const express = require("express");

const app = express();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'shop',
  password: process.env.DB_PASSWORD || 'shop',
  database: process.env.DB_NAME || 'shop',
  port: 5432,
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const PORT = 3000;

app.get("/", (req, res) => {
res.send("Hello from the webshop backend!");
});

app.listen(PORT, () => {
console.log(`Backend running on port ${PORT}`);
});