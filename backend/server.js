const express = require("express");

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.post('/api/orders', async (req, res) => {
  const { name, email, items } = req.body || {};

  if (!name || !email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'name, email and items are required' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }
  if (!items.every(i => Number.isInteger(i.id) && Number.isInteger(i.qty) && i.qty > 0)) {
    return res.status(400).json({ error: 'items must be {id, qty} with qty > 0' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // prices come from the database, never from the client
    const ids = items.map(i => i.id);
    const { rows } = await client.query(
      'SELECT id, price FROM products WHERE id = ANY($1)', [ids]);
    const priceById = new Map(rows.map(r => [r.id, Number(r.price)]));

    let total = 0;
    for (const item of items) {
      if (!priceById.has(item.id)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'unknown product ' + item.id });
      }
      total += priceById.get(item.id) * item.qty;
    }

    const order = await client.query(
      'INSERT INTO orders (customer_name, customer_email, total) VALUES ($1, $2, $3) RETURNING id',
      [name.trim(), email.trim(), total.toFixed(2)]);
    const orderId = order.rows[0].id;

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.qty, priceById.get(item.id)]);
    }

    await client.query('COMMIT');
    res.status(201).json({ orderId, total: Number(total.toFixed(2)) });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}); 
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
app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'product not found' });
    res.json(result.rows[0]);
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