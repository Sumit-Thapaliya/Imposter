/**
 * Environment, read once.
 *
 * Both names are accepted so the repo's existing `.env.example` works as-is:
 *   PORT / SERVER_PORT      port to listen on (default 4000)
 *   ORIGINS / CORS_ORIGIN   comma-separated allow-list; unset means allow all
 */

export const PORT = Number(process.env.SERVER_PORT ?? process.env.PORT ?? 4000);
export const HOST = process.env.SERVER_HOST ?? '0.0.0.0';

const raw = (process.env.ORIGINS ?? process.env.CORS_ORIGIN ?? '').trim();

export const ORIGINS: string[] | '*' =
  raw === '' || raw === '*'
    ? '*'
    : raw
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
