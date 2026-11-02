# The server

Everything in this document is running and tested. The game rules live on the server;
the web app renders state and sends events. There is no database and no login.

```
apps/server      Fastify (HTTP) + Socket.IO (everything real-time)
packages/shared-types/src/contract.ts   the event + state contract, shared by web and mobile
apps/web         the client — talks to the server over a socket
```

---

## Running it

Two processes, in two terminals (or one with `pnpm dev:all`):

```powershell
# terminal 1 — the game server
pnpm dev:server          # http://localhost:4000

# terminal 2 — the web app
pnpm dev:web             # http://localhost:3000
```

Install once, at the repo root:

```powershell
pnpm install
```

The web app finds the server automatically when you browse `localhost`. To play from a
**phone**, point the browser at your machine's LAN IP — e.g.
`http://192.168.1.20:3000` — and set `NEXT_PUBLIC_SERVER_URL=http://192.168.1.20:4000`.
The server already listens on `0.0.0.0`.

Health check while it runs: `curl http://localhost:4000/health`.

---

## What the server owns

| Rule | Where |
| --- | --- |
| which word, and that everyone on the crew gets the **same** one | `game/rules.ts` → `dealRound` |
| who the imposters are (never more than a third of the table) | `game/rules.ts` → `dealRound` |
| that an imposter can never receive the word | `rooms/store.ts` → `publicStateFor` |
| clue order, and that only the named player may send one | `sockets/roomHandlers.ts` |
| the vote tally, ties, and who won | `game/rules.ts` → `resolveVotes` |
| that a vote cannot be cast twice, for yourself, or by a spectator | `sockets/roomHandlers.ts` |
| rate limits on create / join / chat | `lib/rateLimit.ts` |
| clearing a seat when a phone goes away | `sockets/roomHandlers.ts` → `disconnect` |

### The security boundary

`publicStateFor(room, viewer)` produces the snapshot **per socket**. Two consequences
worth knowing:

- the crew's `you.word` is filled in; an imposter's is `null`, and they get
  `you.hint` (a category, never a word list that contains the answer)
- `you.teammates` is only populated when the host turned "reveal teammates" on
- with `voting: 'secret'`, no vote is in any payload until the result screen

The rule tests hammer the first point: 50 random deals, and for each one the imposter's
entire serialised payload is checked for the secret word.

---

## Events

Client → server, all with an optional acknowledgement:

```
room:create  room:join  room:resume  room:leave  room:kick  room:transferHost
room:settings  room:mode  room:start
game:chat  game:clue  game:ready  game:discussion  game:voting  game:vote
game:nextRound  game:again  game:toLobby
draw:stroke  draw:live  draw:clear
```

Server → client:

```
room:state      one personalised snapshot per socket
room:closed     you were removed / your session died
draw:stroke     a finished stroke
draw:live       a finger that is down right now
draw:clear      the board was wiped
```

Every acknowledge is `{ ok: true, session? }` or `{ ok: false, error }`. If the server
never answers, the web client gives up after 8 seconds with a readable message rather
than spinning forever.

---

## Sessions and reconnects

A player's only credential is a 32-byte token, sent on create/join and stored in
`localStorage`. On reconnect the client calls `room:resume` with it and lands back in the
**same seat** — important on a phone, where locking the screen kills the socket.

A dropped player stays in the room for **60 seconds** with their seat held; only then are
they removed (and the host passes to the longest-standing player if it was them).

---

## Deliberately not built

- **No database.** Rooms live in a `Map` and expire after six hours. `rooms/store.ts` is
  the only file that would change if that ever needs to be Postgres.
- **No accounts.** No passwords, no login, no profiles, no dashboard.
- **No voice audio.** The mic dock is a UI placeholder. Real voice needs WebRTC and a
  TURN server — a separate project. Socket.IO would only carry its signalling.
- **No multi-instance support.** Rate limits and rooms are per-process, so running two
  servers behind a load balancer needs Redis.

---

## Tests

```powershell
cd apps\server
npm test          # 10 rule tests, including the word-leak check
npm run typecheck
```

`npm test` uses Node's built-in runner. There are also two end-to-end harnesses in
development: one drives real socket clients through a whole round, the other drives
three separate browser contexts through the same room.
