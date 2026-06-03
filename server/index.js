/*
  Minimal Express auth server (JavaScript)
  - Uses Cloud SQL (Postgres) via `server/db.js`
  - Implements local register/login (bcrypt + JWT)
  - Implements Google OAuth server-side exchange
  Env vars required: JWT_SECRET, APP_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
*/

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
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

async function upsertGoogleUser({ email, name }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const res = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (res.rows.length) {
      const id = res.rows[0].id;
      await client.query('UPDATE users SET name=$1, provider=$2 WHERE id=$3', [name, 'google', id]);
      await client.query('COMMIT');
      return { id, email, name };
    } else {
      const id = uuidv4();
      await client.query(
        'INSERT INTO users(id, name, email, provider) VALUES($1,$2,$3,$4)',
        [id, name, email, 'google']
      );
      await client.query('COMMIT');
      return { id, email, name };
    }
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
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

// Google OAuth endpoints (server-side)
app.get('/api/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirect = `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirect);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('access_type', 'offline');
  res.redirect(url.toString());
});

app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing code');
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) return res.status(400).send('Failed to obtain access token');
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo?alt=json', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();
    const email = profile.email;
    const name = profile.name || profile.email;
    const user = await upsertGoogleUser({ email, name });
    const token = signUser(user);
    res.cookie('session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    return res.redirect(process.env.APP_URL || 'http://localhost:3000');
  } catch (e) {
    console.error(e);
    return res.status(500).send('OAuth failed');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
