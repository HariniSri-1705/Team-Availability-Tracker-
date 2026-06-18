const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function migrate() {
  const DB_PATH = process.env.DB_FILE || path.join(__dirname, '..', 'data.db');
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    available INTEGER DEFAULT 1
  )`);
  // seed if empty
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
      for (const s of sample) await stmt.run(s[0], s[1], s[2]);
    } finally {
      await stmt.finalize();
    }
    console.log('Seeded sample users');
  } else {
    console.log('Users already present, skipping seed');
  }
  await db.close();
}

migrate().catch(err => { console.error(err); process.exit(1); });
