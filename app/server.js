const express = require('express');
const mysql = require('mysql2/promise');
const client = require('prom-client');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Prometheus Metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5]
});
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware do thoi gian phan hoi
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Ket noi MySQL
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'forum_user',
  password: process.env.DB_PASSWORD || 'Forum_Secure_Pass_2026!',
  database: process.env.DB_NAME || 'forum_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

// Endpoint Metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Lay danh sach nguoi dung
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT id, username FROM users ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] Loi truy van users:', err.message);
    res.status(500).json({ error: 'Database query failure' });
  }
});

// Lay danh sach danh muc/chu de
app.get('/api/topics', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM topics ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] Loi truy van topics:', err.message);
    res.status(500).json({ error: 'Database query failure' });
  }
});

// Lay danh sach bai viet theo topic
app.get('/api/posts', async (req, res) => {
  try {
    const [rows] = await dbPool.query(
      `SELECT posts.*, users.username FROM posts 
       JOIN users ON posts.user_id = users.id 
       ORDER BY posts.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] Loi truy van posts:', err.message);
    res.status(500).json({ error: 'Database query failure' });
  }
});

// Tao bai viet moi
app.post('/api/posts', async (req, res) => {
  const { title, content, user_id, topic_id } = req.body;
  if (!title || !content || !user_id || !topic_id) {
    return res.status(400).json({ error: 'Thieu du lieu bat buoc' });
  }
  try {
    const [result] = await dbPool.query(
      'INSERT INTO posts (title, content, user_id, topic_id) VALUES (?, ?, ?, ?)',
      [title, content, user_id, topic_id]
    );
    console.log(`[INFO] Bai viet moi tao ID: ${result.insertId}`);
    res.status(201).json({ id: result.insertId, message: 'Tao bai viet thanh cong' });
  } catch (err) {
    console.error('[ERROR] Loi tao bai viet:', err.message);
    res.status(500).json({ error: 'Database insert failure' });
  }
});

// Lay binh luan cua bai viet
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const [rows] = await dbPool.query(
      `SELECT comments.*, users.username FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE post_id = ? ORDER BY comments.created_at ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] Loi truy van comments:', err.message);
    res.status(500).json({ error: 'Database query failure' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[INFO] Forum App running on port ${PORT}`));
