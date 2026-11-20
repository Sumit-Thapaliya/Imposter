/**
 * Edge-case pass: reconnects, kick/host transfer, drawing mode, two imposters,
 * hints off, secret voting, room limits. Same harness style as e2e-room.mjs.
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

const connect = (token) =>
  new Promise((resolve, reject) => {
    const socket = io(URL, { transports: ['websocket'], reconnection: false, auth: { token } });
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', reject);
  });
const emit = (s, e, p) => new Promise((r) => (p === undefined ? s.emit(e, r) : s.emit(e, p, r)));

const states = new Map();
const track = (s, name) => s.on('room:state', (st) => states.set(name, st));
const waitFor = (name, pred, ms = 4000) =>
  new Promise((res, rej) => {
    const t0 = Date.now();
    const tick = () => {
      const s = states.get(name);
      if (s && pred(s)) return res(s);
      if (Date.now() - t0 > ms) return rej(new Error(`timeout: ${name}`));
      setTimeout(tick, 25);
    };
    tick();
  });

const base = {
  capacity: 4,
  imposters: 1,
  imposterTeam: 'shared',
  rounds: 2,
  domain: 'animals',
  hints: true,
  revealTeammates: true,
  clueTimer: 0,
  discussionTimer: 0,
  autoStart: false,
  channels: 'chat',
  voting: 'secret',
  allowSpectators: true,
  lateJoin: true,
};

console.log('\n— room limits (capacity 4) —');
const host = await connect();
track(host, 'host');
const created = await emit(host, 'room:create', {
  name: 'Host',
  avatar: 'crew-red',
  mode: 'drawing',
  settings: base,
});
check('create drawing room', created.ok === true, JSON.stringify(created));
const code = created.session.code;
const hostToken = created.session.token;

const twoFew = await emit(host, 'room:start');
check('cannot start with one player', twoFew.ok === false, JSON.stringify(twoFew));

const others = [];
for (const [i, name] of ['Bee', 'Cee', 'Dee'].entries()) {
  const s = await connect();
  track(s, name);
  const ack = await emit(s, 'room:join', { code, name, avatar: 'cyber-neon' });
  check(`join ${name} (${i + 2}/4)`, ack.ok === true, JSON.stringify(ack));
  others.push({ socket: s, name, token: ack.session.token, id: ack.session.playerId });
}
const full = await connect();
const overflow = await emit(full, 'room:join', { code, name: 'Late', avatar: 'cyber-neon' });
check('a fifth player cannot join a 4-seat room', overflow.ok === false, JSON.stringify(overflow));
full.close();

console.log('\n— kick —');
const victim = others[2];
const kicked = await emit(host, 'room:kick', { playerId: victim.id });
check('host can kick', kicked.ok === true, JSON.stringify(kicked));
const afterKick = await waitFor('host', (s) => s.players.length === 3);
check('kicked player is gone', afterKick.players.length === 3);
const selfKick = await emit(others[0].socket, 'room:kick', { playerId: created.session.playerId });
check('a non-host cannot kick', selfKick.ok === false, JSON.stringify(selfKick));

console.log('\n— reconnect with the stored token —');
// A kicked player's token must stay dead — that is the point of a kick.
const deadResume = await emit(host, 'room:resume', { code, token: victim.token });
check('a kicked token cannot resume', deadResume.ok === false, JSON.stringify(deadResume));

// A player who merely lost the network keeps their seat.
const dropper = others[1];
dropper.socket.close();
await waitFor('host', (s) => s.players.some((p) => p.id === dropper.id && !p.connected), 4000)
  .then(() => check('a dropped player is marked disconnected', true))
  .catch(() => check('a dropped player is marked disconnected', false));

const revived = await connect(dropper.token);
track(revived, dropper.name);
const resume = await emit(revived, 'room:resume', { code, token: dropper.token });
check('resume is accepted', resume.ok === true, JSON.stringify(resume));
const rejoined = await waitFor('host', (s) => s.players.some((p) => p.id === dropper.id && p.connected));
check('the same seat reconnected', rejoined.players.length === 3, String(rejoined.players.length));
others[1].socket = revived;

const noToken = await connect();
const badResume = await emit(noToken, 'room:resume', { code, token: 'nonsense' });
check('a bogus token is rejected', badResume.ok === false, JSON.stringify(badResume));
noToken.close();

console.log('\n— host transfer —');
const heir = others[0].id;
const transfer = await emit(host, 'room:transferHost', { playerId: heir });
check('host can hand over', transfer.ok === true, JSON.stringify(transfer));
const moved = await waitFor('host', (s) => s.hostId === heir);
check('hostId moved', moved.hostId === heir);
const oldHostKick = await emit(host, 'room:kick', { playerId: heir });
check('the old host lost the power', oldHostKick.ok === false, JSON.stringify(oldHostKick));
const back = await emit(others[0].socket, 'room:transferHost', { playerId: created.session.playerId });
check('and can have it handed back', back.ok === true, JSON.stringify(back));
await waitFor('host', (s) => s.hostId === created.session.playerId);

console.log('\n— host edits the room it already made —');
/**
 * The lobby "Settings" button sends the whole settings object back after every tap,
 * exactly like this. Two things must hold: capacity is the seat count the room was born
 * with (a live edit must never evict people), and a non-host is refused outright.
 */
const live = await emit(host, 'room:settings', {
  settings: { ...base, rounds: 2, domain: 'food', capacity: 8 },
});
check('host can edit live room settings', live.ok === true, JSON.stringify(live));
const afterEdit = await waitFor('host', (s) => s.settings.rounds === 2);
check('the edit is broadcast to the room', afterEdit.settings.rounds === 2, String(afterEdit.settings.rounds));
check('domain edit lands too', afterEdit.settings.domain === 'food', afterEdit.settings.domain);
check(
  'a live edit cannot change the seat count',
  afterEdit.settings.capacity === afterEdit.players.length ||
    afterEdit.settings.capacity === base.capacity,
  `${afterEdit.settings.capacity} vs ${base.capacity}`,
);
const deniedEdit = await emit(others[0].socket, 'room:settings', { settings: { ...base, rounds: 5 } });
check('a guest cannot edit settings', deniedEdit.ok === false, JSON.stringify(deniedEdit));

console.log('\n— start: two imposters, hints off —');
const tweak = await emit(host, 'room:settings', {
  settings: { ...base, imposters: 2, hints: false, voting: 'secret' },
});
check('settings accepted', tweak.ok === true, JSON.stringify(tweak));
const start = await emit(host, 'room:start');
check('round starts', start.ok === true, JSON.stringify(start));

// Dee was kicked earlier and stayed kicked — three players remain.
const names = ['host', ...others.filter((o) => o.name !== victim.name).map((o) => o.name)];
// Drawing rooms deal roles but open straight onto the board — there is no card round.
const views = await Promise.all(names.map((n) => waitFor(n, (s) => s.phase === 'clues')));
const roles = views.map((v) => v.you.role);
// 3 seats caps imposters at floor(3/3) = 1 — the server is right to refuse a second one.
check('imposter count is capped by table size',
  roles.filter((r) => r === 'imposter').length === Math.max(1, Math.floor(roles.length / 3)),
  roles.join());
const imp = views.filter((v) => v.you.role === 'imposter');
check('hints off → no hint for imposters', imp.every((v) => v.you.hint === null),
  imp.map((v) => String(v.you.hint)).join());
check('drawing room has a word for the crew',
  views.some((v) => v.you.role === 'crew' && typeof v.you.word === 'string'));
check('hints off → imposters still get no word', imp.every((v) => v.you.word === null));
check('teammates are named when revealTeammates is on',
  imp.every((v) => Array.isArray(v.you.teammates)), 'teammates missing');

console.log('\n— drawing mode —');
// Only the player whose turn it is may draw.
const currentDrawerId = states.get('host').clueOrder[0];
const drawerName = names.find((n) => states.get(n)?.you.id === currentDrawerId);
const drawer = drawerName === 'host' ? host : others.find((o) => o.name === drawerName).socket;
const bystanderId = states.get('host').clueOrder[1];
const bystanderName = names.find((n) => states.get(n)?.you.id === bystanderId);
const bystander = bystanderName === 'host' ? host : others.find((o) => o.name === bystanderName).socket;
const outOfTurn = await emit(bystander, 'draw:stroke', { points: [0.1, 0.1, 0.2, 0.2], color: '#fff', size: 3 });
check('drawing out of turn is refused', outOfTurn.ok === false, JSON.stringify(outOfTurn));
const stroke = { points: [0.1, 0.1, 0.4, 0.6, 0.9, 0.2], color: '#FB923C', size: 4 };
const pushed = await emit(drawer, 'draw:stroke', stroke);
check('a stroke is accepted', pushed.ok === true, JSON.stringify(pushed));
const withStroke = await waitFor('host', (s) => s.strokes.length === 1);
check('the stroke reaches everyone', withStroke.strokes.length === 1);
check('stroke keeps its colour', withStroke.strokes[0]?.color === '#FB923C', JSON.stringify(withStroke.strokes[0]));

const nonsense = await emit(drawer, 'draw:stroke', { points: [1, 2], color: 'red', size: 999 });
check('an invalid stroke is rejected', nonsense.ok === false, JSON.stringify(nonsense));

const cleared = await emit(drawer, 'draw:clear');
check('the drawer can clear the board', cleared.ok === true, JSON.stringify(cleared));
const afterClear = await waitFor('host', (s) => s.strokes.length === 0);
check('board is empty again', afterClear.strokes.length === 0);

console.log('\n— secret voting hides the tally —');
const clueState = states.get('host');
for (let i = 0; i < clueState.clueOrder.length; i += 1) {
  const ownerId = clueState.clueOrder[i];
  const ownerName = names.find((n) => states.get(n)?.you.id === ownerId);
  const socket = ownerName === 'host' ? host : others.find((o) => o.name === ownerName).socket;
  await emit(socket, 'game:clue', { text: `word ${i}` });
}
await waitFor('host', (s) => s.phase === 'discussion');
await emit(host, 'game:voting');
await waitFor('host', (s) => s.phase === 'voting');

const firstVoter = others[0];
const target = states.get('host').players.find((p) => p.id !== firstVoter.id).id;
await emit(firstVoter.socket, 'game:vote', { targetId: target });
const hidden = await waitFor('host', (s) => s.players.length > 0, 500).catch(() => states.get('host'));
check('secret voting hides the tally while open', (hidden?.votes.length ?? 0) === 0,
  `${hidden?.votes.length} votes visible`);

console.log('\n— leave —');
const leaver = others[2];
const left = await emit(leaver.socket, 'room:leave');
check('a player can leave', left.ok === true, JSON.stringify(left));
const afterLeave = await waitFor('host', (s) => s.players.every((p) => p.id !== others[2].id));
check('they are removed from the room', afterLeave.players.every((p) => p.id !== others[2].id));

[host, revived, ...others.map((o) => o.socket)].forEach((s) => s.close());

console.log(`\n${failures === 0 ? 'ALL EDGE CHECKS PASSED' : `${failures} FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);
