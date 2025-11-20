// db.js -- CommonJS JSON-file store (replacement for lowdb)
const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const defaultData = { users: [], activities: [] };

async function ensureDbFile() {
  try {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
      await writeFile(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error ensuring DB file:', err);
    throw err;
  }
}

async function readDb() {
  await ensureDbFile();
  const content = await readFile(DB_FILE, 'utf8');
  try {
    return JSON.parse(content || '{}');
  } catch (err) {
    // if file corrupted, reset to default
    await writeFile(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    return JSON.parse(JSON.stringify(defaultData));
  }
}

async function writeDb(data) {
  await ensureDbFile();
  await writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/* API functions (async) to match your original db usage */

async function init() {
  await ensureDbFile();
  // ensure structure
  const db = await readDb();
  db.users = db.users || [];
  db.activities = db.activities || [];
  await writeDb(db);
  console.log('DB initialized at', DB_FILE);
}

async function createUser(username, passwordHash, displayName) {
  const db = await readDb();
  const id = db.users.length ? (db.users[db.users.length - 1].id + 1) : 1;
  const user = { id, username, password: passwordHash, displayName };
  db.users.push(user);
  await writeDb(db);
  return user;
}

async function getUserByUsername(username) {
  const db = await readDb();
  return db.users.find(u => u.username === username);
}

async function getUserById(id) {
  const db = await readDb();
  return db.users.find(u => u.id === id);
}

async function createActivity(userId, { type = 'generic', duration = 0, steps = 0, calories = 0, notes = '' } = {}) {
  const db = await readDb();
  const id = db.activities.length ? (db.activities[db.activities.length - 1].id + 1) : 1;
  const timestamp = Date.now();
  const act = { id, userId, type, duration, steps, calories, timestamp, notes };
  db.activities.push(act);
  await writeDb(db);
  return act;
}

async function getActivitiesForUser(userId) {
  const db = await readDb();
  return (db.activities || []).filter(a => a.userId === userId).sort((a, b) => b.timestamp - a.timestamp);
}

module.exports = {
  init,
  createUser,
  getUserByUsername,
  getUserById,
  createActivity,
  getActivitiesForUser
};
