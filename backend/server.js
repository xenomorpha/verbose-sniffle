const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'shop',
  password: process.env.DB_PASSWORD || 'shop',
  database: process.env.DB_NAME || 'shop',
  port: 5432,
});

const PORT = 3000;
const ORDER_STATUSES = ['processing', 'shipped', 'delivered'];

// ============================================
// Health check
// ============================================
app.get('/', (req, res) => {
  res.send('Hello from the webshop backend!');
});

// ============================================
// Products (US1, US6)
// ============================================
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

// ============================================
// Orders (US4 + US8): place an order, creates the user if the e-mail is new
// ============================================
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

    // 1. Find the user by e-mail or create a new one
    const userResult = await client.query(
      `INSERT INTO users (name, email) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name.trim(), email.trim().toLowerCase()]
    );
    const userId = userResult.rows[0].id;

    // 2. Prices come from the database, never from the client
    const ids = items.map(i => i.id);
    const { rows } = await client.query(
      'SELECT id, price FROM products WHERE id = ANY($1)', [ids]
    );
    const priceById = new Map(rows.map(r => [r.id, Number(r.price)]));

    let total = 0;
    for (const item of items) {
      if (!priceById.has(item.id)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'unknown product ' + item.id });
      }
      total += priceById.get(item.id) * item.qty;
    }

    // 3. Create the order (status is 'processing' by default)
    const order = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [userId, total.toFixed(2)]
    );
    const orderId = order.rows[0].id;

    // 4. Save the items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.qty, priceById.get(item.id)]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ orderId, total: Number(total.toFixed(2)), status: 'processing' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ============================================
// Order status (US9): needs order number AND e-mail
// ============================================
app.get('/api/orders/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
  const email = (req.query.email || '').trim().toLowerCase();

  try {
    const orderResult = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at, u.name
       FROM orders o JOIN users u ON u.id = o.user_id
       WHERE o.id = $1 AND u.email = $2`,
      [id, email]
    );
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const itemsResult = await pool.query(
      `SELECT p.name, oi.quantity, oi.unit_price
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id]
    );
    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// Change order status (US10, shop owner)
// ============================================
app.patch('/api/orders/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
  const { status } = req.body || {};
  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'status must be one of: ' + ORDER_STATUSES.join(', ') });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// Start the server (always last)
// ============================================
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});