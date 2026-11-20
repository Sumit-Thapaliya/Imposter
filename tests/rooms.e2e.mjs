/**
 * End-to-end check of the online flow against a real server.
 *
 * Three clients: Sushil (host), Arjun, Maya. Walks create → join → settings → start →
 * reveal → clues → voting → result → next round, and asserts the things that are easy to
 * break: no secret leaks, votes are cast once, the imposter never sees the word.
 *
 * Usage: node e2e-room.mjs http://127.0.0.1:4100
 */
import { io } from 'socket.io-client';

const URL = process.argv[2] ?? 'http://127.0.0.1:4100';
let failures = 0;

const check = (label, ok, extra = '') => {
  if (ok) console.log(`  PASS  ${label}`);
  else {
    failures += 1;
    console.log(`  FAIL  ${label} ${extra}`);
  }
};

const connect = (name) =>
  new Promise((resolve, reject) => {
    const socket = io(URL, { transports: ['websocket'], reconnection: false });
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', reject);
  });

const emit = (socket, event, payload) =>
  new Promise((resolve) => {
    if (payload === undefined) socket.emit(event, resolve);
    else socket.emit(event, payload, resolve);
  });

const states = new Map();
const track = (socket, name) => {
  socket.on('room:state', (state) => states.set(name, state));
};

const waitFor = (name, predicate, ms = 3000) =>
  new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const state = states.get(name);
      if (state && predicate(state)) return resolve(state);
      if (Date.now() - started > ms) return reject(new Error(`timeout waiting for ${name}`));
      setTimeout(tick, 25);
    };
    tick();
  });

const settings = {
  capacity: 6,
  imposters: 1,
  imposterTeam: 'shared',
  rounds: 2,
  domain: 'food',
  hints: true,
  revealTeammates: true,
  clueTimer: 60,
  discussionTimer: 0,
  autoStart: false,
  channels: 'both',
  voting: 'open',
  allowSpectators: true,
  lateJoin: true,
};

const host = await connect('host');
const p2 = await connect('p2');
const p3 = await connect('p3');
[track(host, 'host'), track(p2, 'p2'), track(p3, 'p3')];

console.log('\n— create / join —');
const created = await emit(host, 'room:create', {
  name: 'Sushil',
  avatar: 'crew-red',
  mode: 'word',
  settings,
});
check('host can create a room', created.ok === true, JSON.stringify(created));
const code = created.session?.code;

const j2 = await emit(p2, 'room:join', { code, name: 'Arjun', avatar: 'cyber-neon' });
const j3 = await emit(p3, 'room:join', { code, name: 'Maya', avatar: 'galaxy-cosmic' });
check('two more players join', j2.ok && j3.ok, JSON.stringify([j2, j3]));

const lobby = await waitFor('host', (s) => s.players.length === 3);
check('lobby has 3 players', lobby.players.length === 3);
check('host flagged', lobby.players.filter((p) => p.host).length === 1);
check('phase is lobby', lobby.phase === 'lobby', lobby.phase);
check('no secrets in the lobby', lobby.you.word === null && lobby.you.role === null);

const badJoin = await emit(p2, 'room:join', { code: 'ZZZZ', name: 'X', avatar: 'crew-red' });
check('bad code is rejected', badJoin.ok === false, JSON.stringify(badJoin));

console.log('\n— settings / mode —');
const renamed = await emit(host, 'room:settings', { settings: { ...settings, rounds: 3 } });
check('host can change settings', renamed.ok === true, JSON.stringify(renamed));
const denied = await emit(p2, 'room:settings', { settings: { ...settings, rounds: 5 } });
check('a non-host cannot change settings', denied.ok === false, JSON.stringify(denied));

console.log('\n— start —');
const cannotStart = await emit(p2, 'room:start');
check('a non-host cannot start', cannotStart.ok === false, JSON.stringify(cannotStart));

const started = await emit(host, 'room:start');
check('host starts the round', started.ok === true, JSON.stringify(started));

const reveals = await Promise.all([
  waitFor('host', (s) => s.phase === 'reveal'),
  waitFor('p2', (s) => s.phase === 'reveal'),
  waitFor('p3', (s) => s.phase === 'reveal'),
]);
const roles = reveals.map((s) => s.you.role);
check('everyone got a role', roles.every((r) => r === 'crew' || r === 'imposter'), roles.join());
check('exactly one imposter', roles.filter((r) => r === 'imposter').length === 1, roles.join());

const imposterView = reveals.find((s) => s.you.role === 'imposter');
const crewView = reveals.find((s) => s.you.role === 'crew');
check('imposter sees no word', imposterView.you.word === null, String(imposterView.you.word));
check('imposter gets a hint (hints on)', typeof imposterView.you.hint === 'string');
check('crew sees the word', typeof crewView.you.word === 'string' && crewView.you.word.length > 0);
check('crew gets no hint', crewView.you.hint === null, String(crewView.you.hint));

// A crew word and the imposter hint must never be the same string.
check('hint is not the word', imposterView.you.hint !== crewView.you.word, `${imposterView.you.hint} vs ${crewView.you.word}`);

// Nobody's snapshot may carry another player's word.
const leaked = JSON.stringify(reveals.map((s) => ({ ...s, you: null }))).includes(crewView.you.word);
check('word never appears outside the "you" block', leaked === false);

console.log('\n— ready → clues —');
for (const [socket, name] of [[host, 'host'], [p2, 'p2'], [p3, 'p3']]) {
  const ack = await emit(socket, 'game:ready');
  check(`${name} can ready up`, ack.ok === true, JSON.stringify(ack));
}
const cluePhase = await waitFor('host', (s) => s.phase === 'clues');
check('all ready moves to clues', cluePhase.phase === 'clues', cluePhase.phase);
check('clue order covers every player', cluePhase.clueOrder.length === 3, String(cluePhase.clueOrder.length));

const sockets = { host, p2, p3 };
const ids = Object.fromEntries(
  [...states.entries()].map(([, s]) => [s.you.id, s]),
);
const order = cluePhase.clueOrder;
for (let i = 0; i < order.length; i += 1) {
  const entry = states.get('host').clueOrder[i];
  const owner = [...states.entries()].find(([, s]) => s.you.id === entry)?.[0];
  const ack = await emit(sockets[owner], 'game:clue', { text: `clue ${i + 1}` });
  check(`clue ${i + 1} accepted from ${owner}`, ack.ok === true, JSON.stringify(ack));
}
void ids;

const afterClues = await waitFor('host', (s) => s.phase === 'discussion');
check('clues done → discussion', afterClues.phase === 'discussion', afterClues.phase);
check('chat holds the three clues', afterClues.chat.filter((c) => c.kind === 'clue').length >= 3,
  `chat kinds: ${afterClues.chat.map((c) => c.kind).join(',')}`);

console.log('\n— voting —');
const toVoting = await emit(host, 'game:voting');
check('host opens voting', toVoting.ok === true, JSON.stringify(toVoting));
const voting = await waitFor('host', (s) => s.phase === 'voting');
check('phase is voting', voting.phase === 'voting');

const imposterId = imposterView.you.id;
const crewIds = reveals.filter((s) => s.you.role === 'crew').map((s) => s.you.id);

// every crew votes for the imposter; the imposter votes for the first crew member
for (const [name, state] of [...states.entries()]) {
  const socket = sockets[name];
  const target = state.you.id === imposterId ? crewIds[0] : imposterId;
  const ack = await emit(socket, 'game:vote', { targetId: target });
  check(`${name} voted`, ack.ok === true, JSON.stringify(ack));
  const again = await emit(socket, 'game:vote', { targetId: target });
  check(`${name} cannot vote twice`, again.ok === false, JSON.stringify(again));
}

const result = await waitFor('host', (s) => s.phase === 'result', 4000);
check('all votes → result', result.phase === 'result');
check('result is present', result.result !== null);
check('the imposter was ejected', result.result?.ejectedId === imposterId,
  `${result.result?.ejectedId} vs ${imposterId}`);
check('crew won', result.result?.winner === 'crew', String(result.result?.winner));
check('result reveals the word', typeof result.result?.word === 'string' && result.result.word.length > 0);
check('result lists the imposters', (result.result?.imposters.length ?? 0) === 1);

console.log('\n— next round —');
const nextRound = await emit(host, 'game:nextRound');
check('host can advance the round', nextRound.ok === true, JSON.stringify(nextRound));
const round2 = await waitFor('host', (s) => s.round === 2 && s.phase !== 'result');
check('round counter moved to 2', round2.round === 2, String(round2.round));

console.log('\n— chat —');
const chat = await emit(p2, 'game:chat', { text: 'hello room' });
check('chat is accepted', chat.ok === true, JSON.stringify(chat));
const withChat = await waitFor('host', (s) => s.chat.some((c) => c.text === 'hello room'));
check('chat reaches the other players', withChat.chat.some((c) => c.text === 'hello room'));
const emptyChat = await emit(p2, 'game:chat', { text: '   ' });
check('blank chat is rejected', emptyChat.ok === false, JSON.stringify(emptyChat));

console.log('\n— rooms api —');
const info = await fetch(`${URL}/rooms/${code}`).then((r) => r.json());
check('GET /rooms/:code works', info.code === code, JSON.stringify(info).slice(0, 80));
const missing = await fetch(`${URL}/rooms/NOPE`).then((r) => r.status);
check('unknown room is 404', missing === 404, String(missing));

[host, p2, p3].forEach((s) => s.close());

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
