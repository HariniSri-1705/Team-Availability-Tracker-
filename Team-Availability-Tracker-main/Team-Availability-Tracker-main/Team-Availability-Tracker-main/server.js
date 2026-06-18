const path = require('path');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { param, validationResult } = require('express-validator');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users/:id/toggle', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const updated = await db.toggleAvailability(id);
    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

async function start(port = PORT) {
  try {
    await db.init();
    const server = app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
    return server;
  } catch (err) {
    console.error('Failed to initialize DB', err);
    throw err;
  }
}

if (require.main === module) {
  start().catch(() => process.exit(1));
}

module.exports = { app, start };
