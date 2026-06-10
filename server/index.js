/*
  Minimal Express auth server (JavaScript)
  - Uses Cloud SQL (Postgres) via `server/db.js`
  - Implements local register/login (bcrypt + JWT)
  Env vars required: JWT_SECRET, APP_URL
*/

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function signUser(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
}

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await db.query('INSERT INTO users(id, name, email, password_hash, provider) VALUES($1,$2,$3,$4,$5)', [
      id,
      name,
      email.toLowerCase(),
      hash,
      'local',
    ]);
    const token = signUser({ id, name, email });
    res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    return res.json({ id, name, email });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const r = await db.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!r.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signUser({ id: user.id, name: user.name, email: user.email });
    res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    return res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  const token = req.cookies && req.cookies.session;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return res.json({ id: data.id, name: data.name, email: data.email });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
