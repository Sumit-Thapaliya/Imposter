/**
 * Rules tests — run with `npm test` in apps/server.
 *
 * These exist to pin down the two things that would ruin the game if they broke:
 *   1. an imposter must never be able to see the word
 *   2. a tally must not hand the win to the wrong side
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  dealRound,
  everyoneVoted,
  resolveVotes,
  skipRoles,
  tally,
} from './rules.ts';
import { WORD_BANK, selectWord } from '../../../../packages/shared-types/src/wordBank';
import { DOMAIN_IDS } from '../../../../packages/shared-types/src/localConfig';
import { sanitiseSettings } from '../lib/settings.ts';
import type { PlayerRecord, RoomRecord } from './rules.ts';
import { publicStateFor, pushStroke } from '../rooms/store.ts';

function player(id: string, name: string): PlayerRecord {
  return {
    id,
    token: `tok_${id}`,
    name,
    avatar: 'crew-red',
    host: id === 'p1',
    connected: true,
    socketId: null,
    ready: false,
    spectator: false,
    score: 0,
    role: null,
    word: null,
    hint: null,
  };
}

function room(overrides: Partial<RoomRecord> = {}): RoomRecord {
  return {
    code: 'TEST01',
    mode: 'word',
    settings: {
      capacity: 4,
      imposters: 1,
      imposterTeam: 'separate',
      rounds: 3,
      domain: 'food',
      hints: true,
      revealTeammates: false,
      clueTimer: 60,
      discussionTimer: 0,
      autoStart: false,
      channels: 'chat',
      voting: 'open',
      allowSpectators: false,
      lateJoin: true,
    },
    players: [player('p1', 'Ana'), player('p2', 'Ben'), player('p3', 'Cy'), player('p4', 'Di')],
    phase: 'lobby',
    round: 1,
    clueOrder: [],
    clueIndex: 0,
    chat: [],
    votes: new Map(),
    deadline: null,
    result: null,
    strokes: [],
    createdAt: Date.now(),
    version: 0,
    timer: null,
    word: null,
    hintText: null,
    ...overrides,
  };
}

test('dealing a round hides the word from every imposter', () => {
  for (let run = 0; run < 50; run += 1) {
    const game = room();
    dealRound(game);
    const imposters = game.players.filter((p) => p.role === 'imposter');
    const crew = game.players.filter((p) => p.role === 'crew');

    assert.equal(imposters.length, 1, 'exactly one imposter');
    assert.equal(crew.length, 3);

    for (const imposter of imposters) {
      const view = publicStateFor(game, imposter);
      assert.equal(view.you.word, null, 'imposter must not receive the word');
      assert.equal(view.you.role, 'imposter');
      assert.ok(view.you.hint, 'imposter still gets the category hint');
      // The whole payload, serialised, must not contain the secret word anywhere.
      assert.ok(!JSON.stringify(view).includes(game.word!), 'word leaked in payload');
    }

    for (const member of crew) {
      const view = publicStateFor(game, member);
      assert.equal(view.you.word, game.word);
      assert.equal(view.you.role, 'crew');
      assert.equal(view.you.hint, null);
    }
  }
});

test('imposter teammates are only revealed when the host allows it', () => {
  const game = room();
  game.settings.imposters = 1;
  dealRound(game);
  // Reset the random deal before choosing two imposters for this test.
  for (const player of game.players) player.role = 'crew';
  game.players[0]!.role = 'imposter';
  game.players[1]!.role = 'imposter';

  game.settings.revealTeammates = false;
  assert.deepEqual(publicStateFor(game, game.players[0]!).you.teammates, []);

  game.settings.revealTeammates = true;
  assert.deepEqual(publicStateFor(game, game.players[0]!).you.teammates, ['Ben']);
});

test('the imposter count never exceeds a third of the table', () => {
  for (const seats of [3, 4, 5, 6, 9, 10]) {
    const game = room({ players: [] });
    for (let i = 0; i < seats; i += 1) game.players.push(player(`p${i}`, `P${i}`));
    game.settings.imposters = 3;
    dealRound(game);
    const count = game.players.filter((p) => p.role === 'imposter').length;
    assert.ok(count <= Math.max(1, Math.floor(seats / 3)), `${seats} seats → ${count} imposters`);
    assert.ok(count >= 1);
  }
});

test('ejecting an imposter is a crew win', () => {
  const game = room();
  dealRound(game);
  const imposter = game.players.find((p) => p.role === 'imposter')!;
  for (const voter of game.players) {
    if (voter.id !== imposter.id) game.votes.set(voter.id, imposter.id);
  }
  const result = resolveVotes(game);
  assert.equal(result.caught, true);
  assert.equal(result.winner, 'crew');
  assert.equal(result.ejectedId, imposter.id);
  assert.equal(result.word, game.word);
  assert.equal(result.imposters.length, 1);
});

test('ejecting a crew member is an imposter win', () => {
  const game = room();
  dealRound(game);
  const crew = game.players.filter((p) => p.role === 'crew');
  const victim = crew[0]!;
  for (const voter of game.players) {
    if (voter.id !== victim.id) game.votes.set(voter.id, victim.id);
  }
  const result = resolveVotes(game);
  assert.equal(result.caught, false);
  assert.equal(result.winner, 'imposters');
});

test('a tie ejects nobody and the imposters take it', () => {
  const game = room();
  dealRound(game);
  game.votes.set('p1', 'p2');
  game.votes.set('p2', 'p1');
  game.votes.set('p3', 'p4');
  game.votes.set('p4', 'p3');
  const result = resolveVotes(game);
  assert.equal(result.ejectedId, null);
  assert.equal(result.winner, 'imposters');
});

test('secret voting withholds who voted for whom until the result', () => {
  const game = room();
  game.settings.voting = 'secret';
  dealRound(game);
  game.phase = 'voting';
  game.votes.set('p1', 'p2');
  const hiding = publicStateFor(game, game.players[0]!);
  assert.deepEqual(hiding.votes, []);

  game.phase = 'result';
  game.result = resolveVotes(game);
  const shown = publicStateFor(game, game.players[0]!);
  assert.equal(shown.votes.length, 1);
  assert.equal(shown.votes[0]!.voterName, 'A player');
});

test('everyone has to vote before the round can close', () => {
  const game = room();
  game.votes.set('p1', 'p2');
  assert.equal(everyoneVoted(game), false);
  game.votes.set('p2', 'p1');
  game.votes.set('p3', 'p1');
  game.votes.set('p4', 'p1');
  assert.equal(everyoneVoted(game), true);
});

test('drawing mode skips roles entirely', () => {
  const game = room({ mode: 'drawing' });
  skipRoles(game);
  assert.equal(game.phase, 'clues');
  assert.equal(game.word, null);
  assert.ok(game.players.every((p) => p.role === null));
  assert.equal(game.clueOrder.length, 4);
});

test('the word never changes per player', () => {
  const game = room();
  dealRound(game);
  const words = new Set(game.players.filter((p) => p.role === 'crew').map((p) => p.word));
  assert.equal(words.size, 1);
  assert.equal([...words][0], game.word);
  assert.ok(WORD_BANK.food.some(entry => entry.word === game.word));
});

test('drawing fill is preserved in the room snapshot', () => {
  const game = room();
  pushStroke(game, { kind: 'fill', points: [0.5, 0.5], color: '#ff0000', size: 6 });
  assert.equal(game.strokes[0]?.kind, 'fill');
  assert.deepEqual(game.strokes[0]?.points, [0.5, 0.5]);
});


test('word banks have 200–300 unique words with non-revealing hints', () => {
  for (const domain of DOMAIN_IDS) {
    const bank = WORD_BANK[domain];
    assert.ok(bank.length >= 200 && bank.length <= 300, `${domain}: ${bank.length}`);
    assert.equal(new Set(bank.map(e => e.word.toLowerCase())).size, bank.length);
    for (const entry of bank) {
      assert.ok(entry.word.trim() && entry.hint.trim());
      const escaped = entry.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      assert.doesNotMatch(entry.hint, new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i')); 
      assert.ok(bank.filter(other => other.hint === entry.hint).length >= 5, `${domain}: ${entry.hint}`);
    }
  }
});

test('domain selection, any, invalid input and avoiding immediate repeats', () => {
  for (const domain of DOMAIN_IDS) {
    assert.equal(selectWord(domain, () => 0).domain, domain);
    assert.equal(selectWord(domain, () => 0).word, WORD_BANK[domain][0]!.word);
  }
  assert.equal(selectWord('any', () => 0).domain, 'food');
  assert.equal(selectWord('any', () => 0.999999).domain, 'sports');
  assert.equal(selectWord('bad-domain', () => 0).domain, 'food');
  assert.notEqual(selectWord('food', () => 0, WORD_BANK.food[0]!.word).word, WORD_BANK.food[0]!.word);
  assert.equal(sanitiseSettings({ domain: 'any' }).domain, 'any');
  assert.equal(sanitiseSettings({ domain: 'bad-domain' }).domain, 'food');
});

test('the imposter receives only the correct hint, and no hint when disabled', () => {
  const game = room();
  game.settings.domain = 'animals';
  dealRound(game);
  const imposter = game.players.find(p => p.role === 'imposter')!;
  const view = publicStateFor(game, imposter);
  const selected = WORD_BANK.animals.find(entry => entry.word === game.word)!;
  assert.equal(view.you.word, null);
  assert.equal(view.you.hint, selected.hint);
  assert.ok(!JSON.stringify(view).includes(game.word!));
  game.settings.hints = false;
  dealRound(game);
  const nextImposter = game.players.find(p => p.role === 'imposter')!;
  assert.equal(publicStateFor(game, nextImposter).you.hint, null);
});

test('deals follow each selected domain and keep one word per round', () => {
  for (const domain of DOMAIN_IDS) {
    const game = room();
    game.settings.domain = domain;
    for (let i = 0; i < 5; i++) {
      const last = game.word;
      dealRound(game);
      assert.ok(WORD_BANK[domain].some(entry => entry.word === game.word));
      if (last) assert.notEqual(game.word, last);
      for (const p of game.players.filter(player => player.role === 'crew')) assert.equal(p.word, game.word);
    }
  }
});
