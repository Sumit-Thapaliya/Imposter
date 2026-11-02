# Voice is real now — three browsers proved it

Your plan was almost right. **One command in it was wrong** and would have broken your app.

---

## Your plan, corrected

✅ `pnpm add livekit-server-sdk` in `apps/server` — correct
✅ `pnpm add livekit-client` in `apps/web` — correct
✅ the three `LIVEKIT_*` env vars — correct (I've wired them; you paste yours later)

❌ **This one is wrong:**

```
cd apps/web
pnpm add livekit-client \
  @livekit/react-native \
  @livekit/react-native-expo-plugin \
  @livekit/react-native-webrtc \
  @config-plugins/react-native-webrtc
```

Those five packages are for the **Expo app**, not the web app. Installed into `apps/web` they
do nothing except bloat the web bundle, and `@config-plugins/react-native-webrtc` will try to
patch a native project that doesn't exist there.

When we do the app, it's a **separate** step, from `apps/mobile`:

```powershell
cd apps\mobile
npx expo install @livekit/react-native @livekit/react-native-webrtc @config-plugins/react-native-webrtc
```

…plus `app.json` plugins and a **dev build** — LiveKit does not run in Expo Go. Not needed
yet: your phone can use voice today through the browser.

---

## What I built and verified

I downloaded the real LiveKit server (v1.13.11), ran it locally in dev mode, and drove three
browser contexts through a voice room with fake microphones.

| Check | Result |
| --- | --- |
| Server mints a token | ✅ per player, scoped to `imposter-<roomcode>`, mic-only, 2h |
| Chat-only rooms refused | ✅ "This room is chat only" |
| All three joined the call | ✅ each saw **"3 in the call"** |
| Audio actually received | ✅ **2 remote audio elements each, both playing** |
| Mute | ✅ stops publishing; label flips to "Mic muted" |
| Unmute | ✅ back to "Mic live" |
| Speaking indicator | ✅ avatar chip highlights on active speaker |
| Page errors | none |

The screenshot shows it live: green mic, *"3 in the call"*, and You / Maya / Arjun chips.

---

## What it does

- **Server** (`lib/voice.ts`) holds the API secret and mints a short-lived token per player.
  The browser never sees the secret. The LiveKit room name is the game room code, so room
  `ABCD12` can only join `imposter-ABCD12`.
- **Browser** (`VoiceDock.tsx`) connects with `livekit-client`, publishes the microphone,
  plays every remote audio track, and shows who is in the call and who is talking.
- **Unconfigured is a first-class state.** With no keys, the dock says *"Voice not
  configured"*, disables the button, shows the env var names, and chat keeps working.

## Your turn — three lines

Create a free project at **cloud.livekit.io** (no card), then in `apps/server/.env`:

```
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
```

`.env` is already in `.gitignore` — make sure it stays out of git.

Then restart: `pnpm dev:server`, and `pnpm dev:web`. The mic button lights up.

**Free tier:** 5,000 participant-minutes/month — roughly 33 games of 5 players × 30 min.

## Honest limits

- **HTTPS required off localhost.** A mic on `http://192.168.1.20:3000` is blocked by the
  browser. Test on `localhost`, or use a tunnel (Cloudflare Tunnel is free) for phone testing.
- **App is not wired yet** — that's the Expo dev-build step above, and I'll do it when you ask.
- Muting stops your own publishing; you still receive others, which is what you want.

## Apply

```
NEW  apps/server/src/lib/voice.ts
NEW  apps/web/src/components/room/VoiceDock.tsx
MOD  apps/server/src/sockets/roomHandlers.ts   + voice:join
MOD  apps/web/src/components/room/RoomGame.tsx  real dock replaces the fake switch
MOD  packages/shared-types/src/contract.ts      + voice:join, VoiceAck
MOD  apps/server/package.json                   + livekit-server-sdk, --env-file
MOD  apps/web/package.json                      + livekit-client
MOD  .env.example
```

```powershell
pnpm install
cd apps\server && rmdir /s /q node_modules\.cache 2>$null
cd ..\web && rmdir /s /q .next
npm run dev
```

Then add your LiveKit keys and restart the server.
