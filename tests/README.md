# Tests

Two layers, two commands.

## 1. Unit — game rules (no server needed)

```powershell
cd apps\server
npm test
```

16 assertions covering word dealing, imposter selection, voting, ties and drawing rounds.

## 2. End-to-end — the real server over Socket.IO

Start the server first (in another terminal):

```powershell
cd apps\server
pnpm dev
```

then:

```powershell
cd apps\..\..
pnpm exec node tests\rooms.e2e.mjs http://127.0.0.1:4000
pnpm exec node tests\rooms-edge.e2e.mjs http://127.0.0.1:4000
```

- `rooms.e2e.mjs` — 50 checks: create, join, start, roles, secrets, clues, voting, result,
  next round, chat, `/rooms/:code`.
- `rooms-edge.e2e.mjs` — 40 checks: capacity, kick, reconnect, host transfer, host editing a
  room that already exists, two imposters, hints off, drawing strokes, out-of-turn drawing,
  secret voting, leaving.

Both counts are exact when you run them; the last line of each suite is
`ALL CHECKS PASSED` / `ALL EDGE CHECKS PASSED`.

Both scripts drive the server with a real Socket.IO client — nothing is mocked. If a check
fails it prints `FAIL` with the server's own error text.

Point them at any host: `node tests\rooms.e2e.mjs https://your-server.onrender.com`.
