const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const DB_PATH = process.env.DB_FILE ? process.env.DB_FILE : path.join(__dirname, 'data.db');
let db;

async function init() {
  if (db) return; // already initialized
  db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    available INTEGER DEFAULT 1
  )`);
  await seedIfEmpty();
}

async function seedIfEmpty() {
  const row = await db.get('SELECT COUNT(1) as c FROM users');
  if (row.c === 0) {
    const sample = [
      ['Alex Rivers', 'Senior Developer', 1],
      ['Samantha Chen', 'UX Designer', 0],
      ['Jordan Taylor', 'Project Manager', 1],
      ['Maria Garcia', 'Marketing Lead', 0],
      ['Chris Patel', 'QA Engineer', 1]
    ];
    const stmt = await db.prepare('INSERT INTO users (name, role, available) VALUES (?, ?, ?)');
    try {
      for (const s of sample) {
        await stmt.run(s[0], s[1], s[2]);
      }
    } finally {
      await stmt.finalize();
    }
  }
}

async function getUsers() {
  const rows = await db.all('SELECT id, name, role, available FROM users ORDER BY id');
  return rows.map(r => ({ ...r, available: Boolean(r.available) }));
}

async function toggleAvailability(id) {
  const current = await db.get('SELECT available FROM users WHERE id = ?', id);
  if (!current) throw new Error('User not found');
  const next = current.available ? 0 : 1;
  await db.run('UPDATE users SET available = ? WHERE id = ?', next, id);
  const updated = await db.get('SELECT id, name, role, available FROM users WHERE id = ?', id);
  return { ...updated, available: Boolean(updated.available) };
}

module.exports = { init, getUsers, toggleAvailability };
