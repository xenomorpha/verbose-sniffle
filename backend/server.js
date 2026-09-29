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

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS time');
    res.json({ ok: true, time: result.rows[0].time });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});
const PORT = 3000;

app.get("/", (req, res) => {
res.send("Hello from the webshop backend!");
});

app.listen(PORT, () => {
console.log(`Backend running on port ${PORT}`);
});