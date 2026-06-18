# Team Availability Tracker

Simple dashboard that lists users and lets you toggle their availability. Changes persist to a local SQLite database and update the UI immediately.

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open your browser at `http://localhost:3000`.

### Database migration

Run the migration and seed script once to create `data.db`:

```bash
npm run migrate
```

### Docker

Build and run with Docker:

```bash
docker-compose up --build
```

## Notes

- The app seeds example users on first run.
- Toggle hits `/api/users/:id/toggle` and returns the updated user. Data is persisted to a local SQLite file `data.db`.
