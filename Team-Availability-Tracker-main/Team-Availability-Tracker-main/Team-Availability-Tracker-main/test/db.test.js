const db = require('../db');

beforeAll(async () => {
  process.env.DB_FILE = ':memory:';
  await db.init();
});

afterAll(async () => {
  // no explicit close API from sqlite wrapper; open DB will be freed on process exit
});

test('seeded users are present', async () => {
  const users = await db.getUsers();
  expect(users.length).toBeGreaterThan(0);
});

test('toggle availability flips value', async () => {
  const users = await db.getUsers();
  const u = users[0];
  const before = u.available;
  const updated = await db.toggleAvailability(u.id);
  expect(updated.available).toBe(!before);
});
