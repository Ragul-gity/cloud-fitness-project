const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_for_prod';

// Register
router.post('/register', async (req, res) => {
  const { username, password, displayName } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const existing = await db.getUserByUsername(username);
  if (existing) return res.status(400).json({ error: 'username taken' });
  const hash = await bcrypt.hash(password, 10);
  const user = await db.createUser(username, hash, displayName || username);
  const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, displayName: user.displayName } });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const row = await db.getUserByUsername(username);
  if (!row) return res.status(400).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, row.password);
  if (!ok) return res.status(400).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: row.id, username: row.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: row.id, username: row.username, displayName: row.displayName } });
});

// Simple profile endpoint
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid token' });
  const token = parts[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
};

router.get('/me', authMiddleware, async (req, res) => {
  const row = await db.getUserById(req.user.id);
  res.json({ user: row });
});

module.exports = router;
