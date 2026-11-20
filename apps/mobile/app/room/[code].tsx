import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { ScreenShell } from '../../src/components/ui/Screen';
import {
  CAPACITY,
  CHANNEL_MODES,
  IMPOSTER_RANGE,
  ROUND_RANGE,
  TEAM_MODES,
  maxImpostersFor,
  normaliseSettings,
  ROOM_DOMAIN_CHOICES,
  type RoomSettings,
} from '../../src/shared/settings';
import { colors, radius, shadow, spacing } from '../../src/theme/tokens';
import type { RoomState } from '../../src/shared/contract';
import {
  getSession,
  getSocket,
  send,
  setSession,
  watchConnection,
} from '../../src/lib/rooms/socket';
import { DrawingBoard } from '../../src/components/drawing/DrawingBoard';

/**
 * The room, from lobby to result.
 *
 * One screen driven entirely by `RoomState` from the server — the client never decides
 * anything. Phases come in as `lobby → reveal → clues → discussion → voting → result`;
 * drawing rooms skip `reveal` because the board *is* the reveal.
 *
 * Deliberately one file. The web version splits lobby / game / board into components
 * because it has room for them; on a phone the whole thing is one column, and a second
 * file would only add indirection.
 */

const PHASE_TITLE: Record<RoomState['phase'], string> = {
  lobby: 'Lobby',
  reveal: 'Your card',
  clues: 'Clues',
  discussion: 'Discuss',
  voting: 'Vote',
  result: 'Result',
};

export default function RoomScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState('');
  const [online, setOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const chatRef = useRef<ScrollView | null>(null);

  /* ------------------------------------------------------------ live state */

  useEffect(() => {
    const socket = getSocket();

    const onState = (next: RoomState) => {
      setState(next);
      setError('');
    };
    const onClosed = ({ reason }: { reason: string }) => {
      setSession(null);
      setState(null);
      setError(reason);
    };

    socket.on('room:state', onState);
    socket.on('room:closed', onClosed);

    // Reclaim the seat on mount (a fresh navigation) or after a dropped connection.
    const resume = () => {
      const session = getSession();
      if (!session) return;
      void send('room:resume', { code: session.code, token: session.token }).then((ack) => {
        if (!ack.ok && ack.error) setError(ack.error);
      });
    };
    if (socket.connected) resume();
    else socket.once('connect', resume);

    const stop = watchConnection(setOnline);

    return () => {
      socket.off('room:state', onState);
      socket.off('room:closed', onClosed);
      stop();
    };
  }, []);

  /*
   * The server owns the discussion clock and opens voting itself when it runs out.
   * The phone only has to *show* that clock — before this, the screen jumped to voting
   * with no warning.
   */
  useEffect(() => {
    if (!state?.deadline) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [state?.deadline]);

  useEffect(() => {
    if (!chatOpen) return;
    const id = setTimeout(() => chatRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(id);
  }, [state?.chat.length, chatOpen]);

  /* --------------------------------------------------------------- actions */

  const act = useCallback(async (event: Parameters<typeof send>[0]) => {
    setBusy(true);
    try {
      const ack = await send(event);
      if (!ack.ok) setError(ack.error ?? 'That did not work.');
    } finally {
      setBusy(false);
    }
  }, []);

  async function vote(targetId: string | null) {
    setBusy(true);
    try {
      const ack = await send('game:vote', { targetId });
      if (!ack.ok) setError(ack.error ?? 'Could not vote.');
    } finally {
      setBusy(false);
    }
  }

  async function sendChat() {
    const text = draft.trim();
    if (!text) return;
    const ack = await send('game:chat', { text });
    if (ack.ok) setDraft('');
    else setError(ack.error ?? 'Could not send.');
  }

  async function clue() {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    try {
      const ack = await send('game:clue', { text });
      if (ack.ok) setDraft('');
      else setError(ack.error ?? 'Could not send your clue.');
    } finally {
      setBusy(false);
    }
  }

  /** Host edits the room they already created. The server only allows this in the lobby. */
  async function saveSettings(patch: Partial<RoomSettings>) {
    if (!state) return;
    const next = normaliseSettings({ ...state.settings, ...patch });
    setState({ ...state, settings: next }); // optimistic: the sliders stay under the finger
    const ack = await send('room:settings', { settings: next });
    if (!ack.ok) setError(ack.error ?? 'Could not save the settings.');
  }

  async function passHost(playerId: string) {
    const ack = await send('room:transferHost', { playerId });
    if (!ack.ok) setError(ack.error ?? 'Could not pass host.');
  }

  async function removePlayer(playerId: string) {
    const ack = await send('room:kick', { playerId });
    if (!ack.ok) setError(ack.error ?? 'Could not remove that player.');
  }

  async function passDrawing() {
    setBusy(true);
    try {
      const ack = await send('draw:pass', { keep: true });
      if (!ack.ok) setError(ack.error ?? 'Could not end your turn.');
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    await send('room:leave');
    setSession(null);
    router.push('/play-type');
  }

  /* ----------------------------------------------------------------- render */

  if (!state) {
    return (
      <ScreenShell backdrop="portrait">
        <View style={styles.centre}>
          <Text style={styles.loading}>
            {error ? error : `Joining room ${String(code ?? '').toUpperCase()}…`}
          </Text>
          {error ? (
            <Pressable onPress={() => router.push('/room')} style={styles.ghost}>
              <Text style={styles.ghostText}>Back</Text>
            </Pressable>
          ) : null}
        </View>
      </ScreenShell>
    );
  }

  const me = state.players.find((player) => player.id === state.you.id);
  const isHost = state.hostId === state.you.id;
  const seated = state.players.filter((player) => !player.spectator);
  const canStart = isHost && seated.length >= 3 && state.phase === 'lobby';
  const myTurn = state.clueOrder[state.clueIndex] === state.you.id;
  const isDrawing = state.mode === 'drawing';
  const myVote = state.votes.find((v) => v.voterId === state.you.id);
  const secondsLeft = state.deadline ? Math.max(0, Math.ceil((state.deadline - now) / 1000)) : null;

  return (
    <ScreenShell backdrop="portrait">
      <View style={styles.root}>
        {/* ---- header ---- */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => void leave()}
            accessibilityRole="button"
            accessibilityLabel="Leave the room"
            hitSlop={8}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <Svg viewBox="0 0 24 24" width={22} height={22}>
              <Path
                d="M15 5l-7 7 7 7"
                stroke={colors.text}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </Pressable>
          <View style={styles.titleWrap}>
            <Text style={styles.eyebrow}>
              Room {state.code} · round {state.round}/{state.totalRounds}
            </Text>
            <Text style={styles.title}>
              {PHASE_TITLE[state.phase]}
              {secondsLeft !== null ? ` · ${secondsLeft}s` : ''}
            </Text>
          </View>
          <View
            style={[styles.dot, { backgroundColor: online ? '#59EBAD' : '#FF7A8A' }]}
            accessibilityLabel={online ? 'Connected' : 'Reconnecting'}
          />
        </View>

        {/* ---- the phase card: fills everything between header and actions ---- */}
        <View style={styles.card}>
          {state.phase === 'lobby' && (
            <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Players {seated.length}/{state.settings.capacity}</Text>
              <View style={styles.list}>
                {state.players.map((player) => (
                  <View key={player.id} style={styles.playerRow}>
                    <View
                      style={[
                        styles.avatar,
                        { backgroundColor: player.connected ? '#4C1D95' : '#2A2145' },
                      ]}
                    >
                      <Text style={styles.avatarText}>{player.name.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.playerName}>
                      {player.name}
                      {player.id === state.you.id ? ' (you)' : ''}
                    </Text>
                    {player.host ? <Text style={styles.hostTag}>HOST</Text> : null}
                    {!player.connected ? <Text style={styles.offTag}>AWAY</Text> : null}
                    {isHost && player.id !== state.you.id ? (
                      <>
                        <Pressable
                          onPress={() => void passHost(player.id)}
                          accessibilityRole="button"
                          accessibilityLabel={`Make ${player.name} the host`}
                          hitSlop={6}
                          style={styles.miniBtn}
                        >
                          <Text style={styles.miniBtnText}>Host</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => void removePlayer(player.id)}
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${player.name}`}
                          hitSlop={6}
                          style={[styles.miniBtn, styles.miniBtnDanger]}
                        >
                          <Text style={styles.miniBtnText}>Remove</Text>
                        </Pressable>
                      </>
                    ) : null}
                  </View>
                ))}
              </View>
              <Text style={styles.meta}>
                {state.settings.imposters} imposter{state.settings.imposters > 1 ? 's' : ''} ·{' '}
                {state.settings.domain === 'any' ? 'any category' : state.settings.domain} ·{' '}
                {state.settings.channels === 'chat'
                  ? 'chat'
                  : state.settings.channels === 'voice'
                    ? 'voice'
                    : 'chat + voice'}
              </Text>

              {settingsOpen && isHost ? (
                <View style={styles.sheet}>
                  <Text style={styles.sheetTitle}>Room settings</Text>
                  <Text style={styles.sheetNote}>
                    Saves instantly and applies to everyone. Seat count is fixed once a room exists.
                  </Text>

                  <Stepper
                    label="Imposters"
                    value={state.settings.imposters}
                    min={IMPOSTER_RANGE.min}
                    max={maxImpostersFor(state.settings.capacity)}
                    onChange={(imposters) => void saveSettings({ imposters })}
                  />
                  <Stepper
                    label="Rounds"
                    value={state.settings.rounds}
                    min={ROUND_RANGE.min}
                    max={ROUND_RANGE.max}
                    onChange={(rounds) => void saveSettings({ rounds })}
                  />

                  <Text style={styles.label}>Category</Text>
                  <View style={styles.chipWrap}>
                    {ROOM_DOMAIN_CHOICES.map((choice) => {
                      const active = state.settings.domain === choice.id;
                      return (
                        <Pressable
                          key={choice.id}
                          onPress={() => void saveSettings({ domain: choice.id })}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          style={[styles.chip, active && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {choice.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.label}>Talk</Text>
                  <View style={styles.chipWrap}>
                    {CHANNEL_MODES.map((option) => {
                      const active = state.settings.channels === option.id;
                      return (
                        <Pressable
                          key={option.id}
                          onPress={() => void saveSettings({ channels: option.id })}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          style={[styles.chip, active && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Text style={styles.label}>Imposter words</Text>
                  <View style={styles.chipWrap}>
                    {TEAM_MODES.map((option) => {
                      const active = state.settings.imposterTeam === option.id;
                      return (
                        <Pressable
                          key={option.id}
                          onPress={() => void saveSettings({ imposterTeam: option.id })}
                          accessibilityRole="button"
                          accessibilityState={{ selected: active }}
                          style={[styles.chip, active && styles.chipActive]}
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <Toggle
                    label="Hint for imposter"
                    note="They are told the category"
                    value={state.settings.hints}
                    onChange={(hints) => void saveSettings({ hints })}
                  />
                  <Toggle
                    label="Reveal teammates"
                    note="Imposters see each other"
                    value={state.settings.revealTeammates}
                    onChange={(revealTeammates) => void saveSettings({ revealTeammates })}
                  />
                  <Toggle
                    label="Allow spectators"
                    value={state.settings.allowSpectators}
                    onChange={(allowSpectators) => void saveSettings({ allowSpectators })}
                  />
                </View>
              ) : null}
            </ScrollView>
          )}

          {state.phase === 'reveal' && (
            <View style={[styles.inner, styles.centre]}>
              {state.you.role === 'imposter' ? (
                <>
                  <View style={styles.imposterBadge}>
                    <Svg viewBox="0 0 24 24" width={28} height={28} fill="none">
                      <Path
                        d="M12 3.5l7.5 4.2v7.6L12 19.5 4.5 15.3V7.7L12 3.5Z"
                        stroke="#fff"
                        strokeWidth={1.9}
                        strokeLinejoin="round"
                      />
                      <Circle cx="9.3" cy="11" r="1.15" fill="#fff" />
                      <Circle cx="14.7" cy="11" r="1.15" fill="#fff" />
                    </Svg>
                  </View>
                  <Text style={styles.imposterTitle}>You are the imposter</Text>
                  {state.you.hint ? (
                    <>
                      <Text style={styles.label}>Your hint</Text>
                      <Text style={styles.hint}>{state.you.hint}</Text>
                    </>
                  ) : (
                    <Text style={styles.meta}>No hint — improvise.</Text>
                  )}
                  {state.you.teammates.length > 0 ? (
                    <Text style={styles.meta}>With {state.you.teammates.join(', ')}</Text>
                  ) : null}
                </>
              ) : (
                <>
                  <Text style={styles.label}>The secret word is</Text>
                  <Text style={styles.word}>{state.you.word}</Text>
                </>
              )}
            </View>
          )}

          {(state.phase === 'clues' || state.phase === 'discussion') && (
            <ScrollView
              ref={chatRef}
              contentContainerStyle={styles.inner}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.label}>
                {state.phase === 'clues'
                  ? myTurn
                    ? 'Your turn to give a clue'
                    : `Waiting for ${
                        state.players.find((p) => p.id === state.clueOrder[state.clueIndex])?.name ??
                        'the next player'
                      }`
                  : 'Talk it out'}
              </Text>
              {secondsLeft !== null && state.phase === 'discussion' ? (
                <Text style={styles.clock}>Voting opens in {secondsLeft}s — the host can open it now</Text>
              ) : null}

              {isDrawing ? (
                <DrawingBoard
                  canDraw={myTurn}
                  strokes={state.strokes}
                  onStroke={(stroke) => void send('draw:stroke', stroke)}
                  onDone={myTurn ? () => void passDrawing() : undefined}
                  nextLabel={
                    state.clueOrder[state.clueIndex + 1]
                      ? state.players.find((p) => p.id === state.clueOrder[state.clueIndex + 1])?.name
                      : undefined
                  }
                />
              ) : null}

              <View style={styles.chatList}>
                {state.chat.slice(-40).map((entry) => (
                  <View
                    key={entry.id}
                    style={[
                      styles.bubble,
                      entry.kind === 'system' && styles.bubbleSystem,
                      entry.kind === 'clue' && styles.bubbleClue,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        entry.kind === 'system' && styles.bubbleTextSystem,
                      ]}
                    >
                      {entry.kind === 'system' ? entry.text : `${entry.name}: ${entry.text}`}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {state.phase === 'voting' && (
            <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>
                {state.you.hasVoted ? 'Vote cast — waiting' : 'Who is the imposter?'}
              </Text>
              <View style={styles.list}>
                {seated
                  .filter((player) => player.id !== state.you.id)
                  .map((player) => (
                    <Pressable
                      key={player.id}
                      onPress={() => void vote(player.id)}
                      disabled={state.you.hasVoted || busy}
                      accessibilityRole="button"
                      accessibilityLabel={`Vote for ${player.name}`}
                      style={({ pressed }) => [
                        styles.voteRow,
                        myVote?.targetId === player.id && styles.voteRowPicked,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={styles.playerName}>{player.name}</Text>
                      {myVote?.targetId === player.id ? (
                        <Text style={styles.voteTick}>voted</Text>
                      ) : null}
                    </Pressable>
                  ))}
              </View>
              {!state.you.hasVoted ? (
                <Pressable onPress={() => void vote(null)} style={styles.ghost}>
                  <Text style={styles.ghostText}>Abstain</Text>
                </Pressable>
              ) : null}
            </ScrollView>
          )}

          {state.phase === 'result' && state.result && (
            <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>
                {state.result.ejectedName
                  ? `${state.result.ejectedName} was voted out`
                  : 'Nobody was voted out'}
              </Text>
              <Text
                style={[
                  styles.verdict,
                  {
                    color:
                      state.result.winner === 'crew'
                        ? '#4ADE80'
                        : state.result.winner === 'imposters'
                          ? '#F472B6'
                          : '#E3C77A',
                  },
                ]}
              >
                {state.result.winner === 'crew'
                  ? 'Crew wins'
                  : state.result.winner === 'imposters'
                    ? 'Imposters win'
                    : 'No winner'}
              </Text>

              <View style={styles.divider} />
              <Text style={styles.label}>The imposters were</Text>
              <View style={styles.wrap}>
                {state.result.imposters.map((player) => (
                  <View key={player.id} style={styles.imposterPill}>
                    <Text style={styles.imposterPillText}>{player.name}</Text>
                  </View>
                ))}
              </View>

              {state.result.word ? (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.label}>The word was</Text>
                  <Text style={styles.word}>{state.result.word}</Text>
                </>
              ) : null}

              <View style={styles.divider} />
              <Text style={styles.label}>Scores</Text>
              {state.players.map((player) => (
                <View key={player.id} style={styles.playerRow}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.score}>{player.score}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        {/* ---- actions ---- */}
        <View style={styles.actions}>
          {state.phase === 'lobby' && (
            isHost ? (
              <>
                <View style={styles.splitRow}>
                  <View style={styles.splitMain}>
                    <Primary
                      label={canStart ? 'Start game' : `Need ${3 - seated.length} more`}
                      disabled={!canStart || busy}
                      onPress={() => void act('room:start')}
                    />
                  </View>
                  <Pressable
                    onPress={() => setSettingsOpen((open) => !open)}
                    accessibilityRole="button"
                    accessibilityLabel="Room settings"
                    style={({ pressed }) => [styles.settingsBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.settingsBtnText}>{settingsOpen ? 'Hide' : 'Settings'}</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Text style={styles.waiting}>Waiting for the host to start…</Text>
            )
          )}

          {state.phase === 'reveal' && (
            <Primary label={busy ? '…' : 'I have seen my card'} disabled={busy} onPress={() => void act('game:ready')} />
          )}

          {state.phase === 'clues' && (
            <View style={styles.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={myTurn ? 'Your clue' : 'Chat'}
                placeholderTextColor="rgba(245,240,255,0.3)"
                maxLength={240}
                style={styles.chatInput}
                editable={myTurn || !isDrawing}
              />
              <Pressable
                onPress={() => void (myTurn && state.phase === 'clues' ? clue() : sendChat())}
                accessibilityRole="button"
                accessibilityLabel="Send"
                style={styles.sendBtn}
              >
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          )}

          {state.phase === 'discussion' && (
            <View style={styles.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Say something"
                placeholderTextColor="rgba(245,240,255,0.3)"
                maxLength={240}
                style={styles.chatInput}
              />
              <Pressable onPress={() => void sendChat()} accessibilityRole="button" accessibilityLabel="Send" style={styles.sendBtn}>
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          )}

          {state.phase === 'discussion' && isHost && (
            <Ghost label="Open voting" onPress={() => void act('game:voting')} />
          )}

          {state.phase === 'voting' && !state.you.hasVoted && (
            <Text style={styles.waiting}>
              {state.votes.length}/{seated.length} votes in
            </Text>
          )}

          {state.phase === 'result' && (
            <>
              {isHost && state.round < state.totalRounds ? (
                <Primary label="Next round" disabled={busy} onPress={() => void act('game:nextRound')} />
              ) : null}
              <Ghost label="Play again" onPress={() => void act('game:again')} />
              <Ghost label="Back to lobby" onPress={() => void act('game:toLobby')} />
            </>
          )}
        </View>

        {/* chat is always reachable, even while voting */}
        {state.phase !== 'clues' && state.phase !== 'discussion' && (
          <Pressable
            onPress={() => setChatOpen((open) => !open)}
            accessibilityRole="button"
            accessibilityLabel="Toggle chat"
            style={styles.chatToggle}
          >
            <Text style={styles.chatToggleText}>
              {chatOpen ? 'Hide chat' : `Chat (${state.chat.length})`}
            </Text>
          </Pressable>
        )}

        {chatOpen && state.phase !== 'clues' && state.phase !== 'discussion' && (
          <ScrollView ref={chatRef} style={styles.chatPanel} contentContainerStyle={styles.chatList}>
            {state.chat.slice(-30).map((entry) => (
              <View
                key={entry.id}
                style={[
                  styles.bubble,
                  entry.kind === 'system' && styles.bubbleSystem,
                  entry.kind === 'clue' && styles.bubbleClue,
                ]}
              >
                <Text style={[styles.bubbleText, entry.kind === 'system' && styles.bubbleTextSystem]}>
                  {entry.kind === 'system' ? entry.text : `${entry.name}: ${entry.text}`}
                </Text>
              </View>
            ))}
            <View style={styles.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Message"
                placeholderTextColor="rgba(245,240,255,0.3)"
                maxLength={240}
                style={styles.chatInput}
              />
              <Pressable onPress={() => void sendChat()} accessibilityRole="button" accessibilityLabel="Send" style={styles.sendBtn}>
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

        {me ? null : <Text style={styles.error}>You are not seated in this room.</Text>}
      </View>
    </ScreenShell>
  );
}

/* ------------------------------------------------------------------ pieces */

function Primary({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      <LinearGradient
        colors={['#A78BFA', '#7C3AED']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.primary, disabled && styles.disabled]}
      >
        <Text style={styles.primaryText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function Ghost({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}
    >
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.playerName}>{label}</Text>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        accessibilityRole="button"
        accessibilityLabel={`Fewer ${label}`}
        style={[styles.stepBtn, value <= min && styles.disabled]}
      >
        <Text style={styles.stepBtnText}>−</Text>
      </Pressable>
      <Text style={styles.stepValue}>{value}</Text>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        accessibilityRole="button"
        accessibilityLabel={`More ${label}`}
        style={[styles.stepBtn, value >= max && styles.disabled]}
      >
        <Text style={styles.stepBtnText}>+</Text>
      </Pressable>
    </View>
  );
}

function Toggle({
  label,
  note,
  value,
  onChange,
}: {
  label: string;
  note?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      style={styles.toggleRow}
    >
      <View style={styles.toggleText}>
        <Text style={styles.playerName}>{label}</Text>
        {note ? <Text style={styles.toggleNote}>{note}</Text> : null}
      </View>
      <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
        <View style={[styles.toggleKnob, value && styles.toggleKnobOn]} />
      </View>
    </Pressable>
  );
}

/* ------------------------------------------------------------------ styles */

const styles = StyleSheet.create({
  root: { flex: 1, gap: 10 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loading: { fontSize: 15, fontWeight: '700', color: 'rgba(245,240,255,0.7)', textAlign: 'center' },

  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: {
    height: 44,
    width: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,6,24,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.45)',
  },
  titleWrap: { flex: 1, alignItems: 'center', gap: 1 },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1.4, color: '#C4B5FD' },
  title: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  dot: { height: 10, width: 10, borderRadius: 5, marginRight: 14 },

  card: {
    flex: 1,
    backgroundColor: 'rgba(18,10,38,0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    padding: spacing.s3,
    ...shadow.card,
  },
  inner: { gap: 8, paddingBottom: 4 },

  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#C0B2DE',
    textTransform: 'uppercase',
  },
  meta: { fontSize: 13, fontWeight: '600', color: 'rgba(245,240,255,0.55)', lineHeight: 16 },
  clock: { fontSize: 13, fontWeight: '800', color: '#FFCF50' },

  list: { gap: 6 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  avatar: { height: 30, width: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  playerName: { flex: 1, fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  hostTag: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#FFCF50' },
  offTag: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#FF9AA6' },
  score: { fontSize: 16, fontWeight: '800', color: '#FFCF50', fontVariant: ['tabular-nums'] },
  miniBtn: {
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: 'rgba(75,54,117,0.85)',
  },
  miniBtnDanger: { backgroundColor: 'rgba(122,36,74,0.8)' },
  miniBtnText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, color: '#FFFFFF' },

  splitRow: { flexDirection: 'row', gap: 8 },
  splitMain: { flex: 1 },
  settingsBtn: {
    borderRadius: 16,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#4B3675',
    borderWidth: 1,
    borderColor: 'rgba(196,154,255,0.4)',
  },
  settingsBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#E9DCFF',
    textTransform: 'uppercase',
  },

  sheet: {
    marginTop: 6,
    gap: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(42,29,74,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(108,86,147,0.6)',
    padding: 10,
  },
  sheetTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1.4, color: '#C4B5FD', textTransform: 'uppercase' },
  sheetNote: { fontSize: 12, fontWeight: '600', color: 'rgba(245,240,255,0.5)', lineHeight: 14 },

  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    height: 28,
    width: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  stepBtnText: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  stepValue: { minWidth: 18, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#FFFFFF' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  chip: {
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipActive: { backgroundColor: '#6D28D9', borderColor: '#C4B5FD' },
  chipText: { fontSize: 12, fontWeight: '800', color: 'rgba(245,240,255,0.7)' },
  chipTextActive: { color: '#FFFFFF' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleText: { flex: 1, gap: 1 },
  toggleNote: { fontSize: 12, fontWeight: '600', color: 'rgba(245,240,255,0.45)' },
  toggleTrack: {
    height: 22,
    width: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.14)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleTrackOn: { backgroundColor: '#7C3AED' },
  toggleKnob: { height: 18, width: 18, borderRadius: 9, backgroundColor: '#FFFFFF' },
  toggleKnobOn: { alignSelf: 'flex-end' },

  imposterBadge: {
    height: 58,
    width: 58,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9D174D',
  },
  imposterTitle: { fontSize: 23, fontWeight: '800', color: '#FBCFE8', textAlign: 'center' },
  hint: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 240,
  },
  word: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(124,58,237,0.7)',
    textShadowRadius: 18,
  },
  verdict: { fontSize: 26, fontWeight: '800', textAlign: 'center' },

  chatList: { gap: 5 },
  bubble: {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  bubbleSystem: { backgroundColor: 'transparent', borderColor: 'transparent', paddingVertical: 2 },
  bubbleClue: { backgroundColor: 'rgba(124,58,237,0.22)', borderColor: 'rgba(167,139,250,0.35)' },
  bubbleText: { fontSize: 13, fontWeight: '600', color: '#F5F0FF', lineHeight: 17 },
  bubbleTextSystem: { fontSize: 12, fontWeight: '700', color: 'rgba(196,181,253,0.85)' },

  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  voteRowPicked: { backgroundColor: 'rgba(34,197,94,0.18)', borderColor: 'rgba(34,197,94,0.45)' },
  voteTick: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#4ADE80' },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.10)', marginVertical: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  imposterPill: {
    borderRadius: radius.pill,
    backgroundColor: '#9D174D',
    paddingHorizontal: 13,
    paddingVertical: 6,
  },
  imposterPillText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },

  error: {
    marginTop: 8,
    borderRadius: 11,
    backgroundColor: 'rgba(122,36,74,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD1D8',
  },

  actions: { gap: 8 },
  waiting: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(245,240,255,0.6)',
    textAlign: 'center',
    paddingVertical: 6,
  },

  inputRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  chatInput: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.45)',
    backgroundColor: 'rgba(11,6,24,0.8)',
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sendBtn: {
    borderRadius: 12,
    backgroundColor: '#5933A2',
    borderWidth: 1,
    borderColor: 'rgba(196,154,255,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  sendText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8, color: '#FFFFFF' },

  chatToggle: {
    alignSelf: 'center',
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chatToggleText: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#FFFFFF' },
  chatPanel: {
    maxHeight: 190,
    borderRadius: 14,
    backgroundColor: 'rgba(11,6,24,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 8,
  },

  primary: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#4C1D95',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  ghost: {
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  ghostText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  pressed: { transform: [{ translateY: 1 }], opacity: 0.96 },
  disabled: { opacity: 0.45 },
});
