const request = require('supertest');
process.env.DB_FILE = ':memory:';
const { app, start } = require('../server');
const db = require('../db');

let server;

beforeAll(async () => {
  await db.init();
  server = await start(0); // random open port
});

afterAll(async () => {
  if (server && server.close) server.close();
});

test('GET /api/users returns list', async () => {
  const res = await request(app).get('/api/users');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.users)).toBe(true);
});

test('POST /api/users/:id/toggle toggles and returns user', async () => {
  const users = await db.getUsers();
  const id = users[0].id;
  const res = await request(app).post(`/api/users/${id}/toggle`);
  expect(res.statusCode).toBe(200);
  expect(res.body.user).toHaveProperty('id', id);
});
