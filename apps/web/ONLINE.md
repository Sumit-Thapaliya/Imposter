# Online room prototype

On the web app, choose Online, then create or join a room. The host selects a character, name, game mode and capacity (3–10). Share the six-character code; other players enter it with their own name and character. The lobby updates every three seconds.

Run from the repository root: `pnpm install` then `pnpm run dev:web`. To play with others, everyone must access the same running server over a shared network address (not their own localhost). HTTPS is recommended, and is required for cross-site embedded cookies. In a preview that blocks third-party cookies, open the app in a new tab.

This is room setup only, not gameplay. Rooms and membership are stored in memory, expire after 24 hours, and disappear when the server restarts. Use a single long-running Node.js server; multiple instances or serverless deployments will not share rooms. This is not a production backend: add persistent/shared storage, rate limiting, reconnect/leave handling and security review before deployment.
