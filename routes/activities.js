const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_for_prod';

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

// Create activity
router.post('/', authMiddleware, async (req, res) => {
  const { type, duration, steps, calories, notes } = req.body;
  const act = await db.createActivity(req.user.id, { type, duration, steps, calories, notes });
  res.json(act);
});

// Get activities for current user (most recent first)
router.get('/', authMiddleware, async (req, res) => {
  const rows = await db.getActivitiesForUser(req.user.id);
  res.json({ activities: rows });
});

module.exports = router;
