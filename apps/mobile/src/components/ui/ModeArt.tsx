import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

/**
 * Mode artwork for the four choice cards.
 *
 * These replace the flat 1.9px line glyphs. On a phone those read as placeholder icons — the same
 * weight as a system icon at the same size, on a saturated card. These are filled, two-tone
 * illustrations with a highlight, so each card looks drawn rather than assembled.
 *
 * Every icon is 48×48 inside the card's rounded tile and shares the same light-source direction:
 * highlight top-left, shadow bottom-right.
 */

const SIZE = 44;

/** Local → a house (play at home, everyone in one room). */
export function LocalArt() {
  return (
    <Svg viewBox="0 0 48 48" width={SIZE} height={SIZE}>
      <Defs>
        <LinearGradient id="localRoof" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#D7FBE8" />
        </LinearGradient>
        <LinearGradient id="localBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#F0FFF7" />
          <Stop offset="100%" stopColor="#B8F2D4" />
        </LinearGradient>
      </Defs>
      {/* body */}
      <Rect x="11" y="21" width="26" height="19" rx="3.5" fill="url(#localBody)" />
      {/* roof */}
      <Path d="M24 6L41 20H7L24 6Z" fill="url(#localRoof)" />
      {/* chimney */}
      <Rect x="32" y="11" width="4.5" height="8" rx="1.6" fill="#FFFFFF" opacity="0.9" />
      {/* door */}
      <Path d="M20 40V30.5a4 4 0 0 1 8 0V40H20Z" fill="#15803D" />
      {/* windows */}
      <Circle cx="16.5" cy="27" r="2.1" fill="#0B4D26" />
      <Circle cx="31.5" cy="27" r="2.1" fill="#0B4D26" />
      {/* ground shadow */}
      <Rect x="7" y="41" width="34" height="2.6" rx="1.3" fill="#0B4D26" opacity="0.45" />
    </Svg>
  );
}

/** Online → a signal radiating from a device, i.e. people in different places. */
export function OnlineArt() {
  return (
    <Svg viewBox="0 0 48 48" width={SIZE} height={SIZE}>
      <Defs>
        <LinearGradient id="onlineArc" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#CFE6FF" />
        </LinearGradient>
        <LinearGradient id="onlinePhone" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#BFDBFE" />
        </LinearGradient>
      </Defs>
      {/* phone */}
      <Rect x="17" y="17" width="14" height="25" rx="3.6" fill="url(#onlinePhone)" />
      <Rect x="20.2" y="20.4" width="7.6" height="14" rx="1.6" fill="#1D4ED8" opacity="0.85" />
      <Circle cx="24" cy="38.6" r="1.5" fill="#1D4ED8" />
      {/* signal arcs */}
      <G stroke="url(#onlineArc)" strokeWidth="2.8" strokeLinecap="round" fill="none">
        <Path d="M13.5 13.5a14 14 0 0 1 0 0" />
        <Path d="M11 16a17 17 0 0 1 0 15" opacity="0.95" />
        <Path d="M6.5 12a24 24 0 0 0 0 23" opacity="0.6" />
        <Path d="M37 16a17 17 0 0 0 0 15" opacity="0.95" />
        <Path d="M41.5 12a24 24 0 0 1 0 23" opacity="0.6" />
      </G>
      <Rect x="8" y="42" width="32" height="2.6" rx="1.3" fill="#122E6B" opacity="0.45" />
    </Svg>
  );
}

/** Word → a speech card: someone is describing the word, someone is bluffing. */
export function WordArt() {
  return (
    <Svg viewBox="0 0 48 48" width={SIZE} height={SIZE}>
      <Defs>
        <LinearGradient id="wordBubble" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#EDE3FF" />
        </LinearGradient>
      </Defs>
      {/* back bubble */}
      <Path
        d="M15 12h25a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H26l-6 5v-5h-5a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z"
        fill="#FFFFFF"
        opacity="0.35"
        transform="translate(3,3)"
      />
      {/* front bubble */}
      <Path
        d="M9 9h23a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H22l-7 6v-6H9a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4Z"
        fill="url(#wordBubble)"
      />
      {/* three clue lines */}
      <G stroke="#5B21B6" strokeWidth="2.8" strokeLinecap="round">
        <Path d="M12.5 17.5h16" />
        <Path d="M12.5 22.5h11" />
        <Path d="M12.5 27.5h7" opacity="0.6" />
      </G>
    </Svg>
  );
}

/** Drawing → a pencil over a stroke: the crew builds one picture together. */
export function DrawingArt() {
  return (
    <Svg viewBox="0 0 48 48" width={SIZE} height={SIZE}>
      <Defs>
        <LinearGradient id="pencilBody" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#FFE3C7" />
        </LinearGradient>
      </Defs>
      {/* the stroke being drawn */}
      <Path
        d="M5 37c5-7 9-7 13-2s9 5 13-1"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      {/* pencil */}
      <G transform="rotate(-45 24 24)">
        <Rect x="20" y="6" width="8" height="25" rx="1.6" fill="url(#pencilBody)" />
        <Path d="M20 31h8l-4 7-4-7Z" fill="#FBBF24" />
        <Path d="M22.4 35.4h3.2L24 38.6l-1.6-3.2Z" fill="#7C2D12" />
        <Rect x="20" y="6" width="8" height="3.4" rx="1.4" fill="#EA580C" />
      </G>
      <Rect x="6" y="41" width="36" height="2.6" rx="1.3" fill="#7C2D12" opacity="0.4" />
    </Svg>
  );
}
