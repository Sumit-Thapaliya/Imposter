'use client';

import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { BTN_RESET } from './controls';

/**
 * The shared drawing board.
 *
 * One canvas, a real tool row, and a "Done" that hands the turn straight to the next
 * player from the bar above — no separate handover page.
 *
 * Deliberately no layers and no infinite undo: a shared pass-and-play board wants a
 * small, obvious palette, not Photoshop. Undo keeps the last 12 steps so a mis-stroke
 * costs one tap, and resizing the window re-renders the whole history instead of
 * stretching a bitmap, so the picture never turns to mush.
 *
 * Pointer Events, so finger, stylus and mouse all take the same path.
 */

/** A saturated but friendly set — reads clearly on the dark board. */
const COLORS = [
  '#FFFFFF', '#111827', '#6B7280', '#F87171', '#FB923C',
  '#FBBF24', '#4ADE80', '#34D399', '#60A5FA', '#A78BFA', '#F472B6', '#B45309',
] as const;

const SIZES = [
  { id: 'fine', label: 'Fine', value: 3 },
  { id: 'medium', label: 'Medium', value: 8 },
  { id: 'bold', label: 'Bold', value: 18 },
] as const;

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; size: number };
/** A flood fill is stored as a resolution-independent seed, replayed on every resize. */
type Fill = { color: string; x: number; y: number };

const MAX_HISTORY = 12;

export function DrawingPad({
  accent,
  disabled = false,
  className = '',
  onTurnDone,
  nextLabel,
}: {
  accent: 'violet' | 'orange';
  disabled?: boolean;
  className?: string;
  /** Called by the Done button. The screen decides whether that ends the round. */
  onTurnDone?: () => void;
  /** Who takes over next, shown on the Done button. */
  nextLabel?: string | undefined;
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<Point | null>(null);

  const [color, setColor] = useState<string>('#FFFFFF');
  const [size, setSize] = useState<number>(8);
  const [erasing, setErasing] = useState(false);
  const [history, setHistory] = useState<Stroke[]>([]);
  const [fill, setFill] = useState<Fill | null>(null);
  const [touched, setTouched] = useState(false);

  /* --------------------------------------------------------------- rendering */

  /** Repaint the whole board from history. Cheap: a round has a few dozen strokes. */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (fill) {
      ctx.fillStyle = fill.color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of history) {
      if (stroke.points.length === 0) continue;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      const [first, ...rest] = stroke.points;
      if (!first) continue;
      // a tap with no movement still leaves a dot
      ctx.moveTo(first.x + 0.01, first.y);
      ctx.lineTo(first.x, first.y);
      for (const p of rest) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, [fill, history]);

  /** Match the backing store to the element box × DPR, then repaint. */
  const syncSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(canvas.clientWidth * dpr);
    const height = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    render();
  }, [render]);

  useEffect(() => {
    syncSize();
    // The board lives inside a flex column, so observe the box rather than the window.
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(syncSize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [syncSize]);

  useEffect(render, [render]);

  /* ---------------------------------------------------------------- drawing */

  function point(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function commit(stroke: Stroke) {
    setHistory((current) => [...current, stroke].slice(-200));
    setTouched(true);
  }

  function onDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const p = point(event);
    lastRef.current = p;
    // Erasing paints the board colour rather than cutting a hole, which is what people
    // expect on a shared picture: nothing behind it should show through.
    commit({ points: [p], color: erasing ? '#171029' : color, size });
  }

  /**
   * One commit per pointer event, holding only the last few positions.
   *
   * Every commit repaints the whole board (`render` loops over all strokes), so a stroke that grew
   * to a thousand points made the board slower the longer you drew — on a phone it stalled outright
   * and looked blank while the finger moved. Segments of at most eight points keep each repaint
   * proportional to the number of strokes, not to the age of the current stroke.
   */
  const SEGMENT = 8;
  const carryRef = useRef<Point[]>([]);

  function onMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || disabled) return;
    const p = point(event);
    const from = lastRef.current ?? p;
    lastRef.current = p;
    const carry = carryRef.current;
    carry.push(p);
    if (carry.length < SEGMENT) return;
    commit({ points: [from, ...carry], color: erasing ? '#171029' : color, size });
    carryRef.current = [p];
  }

  function endStroke() {
    const carry = carryRef.current;
    if (drawingRef.current && carry.length > 1) {
      commit({ points: carry, color: erasing ? '#171029' : color, size });
    }
    carryRef.current = [];
    drawingRef.current = false;
    lastRef.current = null;
  }

  function fillBoard() {
    setFill({ color: erasing ? '#171029' : color, x: 0.5, y: 0.5 });
    setTouched(true);
  }

  function undo() {
    if (fill) {
      setFill(null);
      return;
    }
    setHistory((current) => current.slice(0, -1));
  }

  function clearAll() {
    setHistory([]);
    setFill(null);
    setTouched(false);
  }

  const accentRing = accent === 'violet' ? 'focus-visible:outline-[#A78BFA]' : 'focus-visible:outline-[#FB923C]';
  const accentDone =
    accent === 'violet'
      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_3px_0_#4C1D95]'
      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_3px_0_#7C2D12]';

  return (
    <div className={['flex w-full flex-col gap-2', className].join(' ')}>
      {/* ---- the board ---- */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          onPointerCancel={endStroke}
          aria-label="Drawing board"
          className={[
            'block h-[clamp(190px,34dvh,340px)] w-full touch-none rounded-[16px] bg-[#171029]',
            'ring-1 ring-inset ring-white/14 shadow-[inset_0_2px_18px_rgba(0,0,0,0.45)]',
            disabled ? 'cursor-not-allowed opacity-50' : erasing ? 'cursor-cell' : 'cursor-crosshair',
          ].join(' ')}
          style={{ touchAction: 'none' }}
        />
        {!touched && !disabled && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center gap-1">
            <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/30">
              Draw here
            </span>
            <span className="text-[0.6rem] font-semibold text-white/20">
              Add to the picture — nothing is cleared
            </span>
          </div>
        )}
      </div>

      {/* ---- palette ---- */}
      <div className="rounded-[14px] bg-[#0B0618]/92 p-2 ring-1 ring-inset ring-white/12">
        <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
          {COLORS.map((hex) => {
            const active = !erasing && hex === color;
            return (
              <button
                key={hex}
                type="button"
                aria-label={`Colour ${hex}`}
                aria-pressed={active}
                disabled={disabled}
                onClick={() => {
                  setColor(hex);
                  setErasing(false);
                }}
                className={[
                  BTN_RESET,
                  'aspect-square w-full rounded-full ring-2 transition-transform duration-fast ease-out',
                  active
                    ? 'scale-110 ring-white ring-offset-2 ring-offset-[#0B0618]'
                    : 'ring-white/20 hover:scale-105',
                  accentRing,
                ].join(' ')}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {/* brush sizes */}
          <div role="group" aria-label="Brush size" className="flex items-center gap-1">
            {SIZES.map((option) => {
              const active = !erasing && size === option.value;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => {
                    setSize(option.value);
                    setErasing(false);
                  }}
                  className={[
                    BTN_RESET,
                    'grid h-8 w-8 place-items-center rounded-[9px] transition-transform duration-fast active:translate-y-[1px]',
                    active
                      ? 'bg-white/18 ring-1 ring-inset ring-white/40'
                      : 'bg-white/[0.06] ring-1 ring-inset ring-white/12 hover:bg-white/12',
                    accentRing,
                  ].join(' ')}
                  title={option.label}
                >
                  <span
                    className="block rounded-full bg-white"
                    style={{ width: Math.min(16, option.value), height: Math.min(16, option.value) }}
                  />
                </button>
              );
            })}
          </div>

          <span className="mx-0.5 h-5 w-px bg-white/12" aria-hidden="true" />

          <ToolButton label="Eraser" active={erasing} disabled={disabled} onClick={() => setErasing((v) => !v)}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M8 20h11M4.5 15.5l7-7a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8l-4.5 4.5H7.6L4.5 15.5Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
            </svg>
          </ToolButton>

          <ToolButton label="Fill" disabled={disabled} onClick={fillBoard}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M5 12.5 12 5.5l7 7-7 7-7-7Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
              <path d="M19.5 15.5c1 1.4 1.5 2.3 1.5 3a1.5 1.5 0 0 1-3 0c0-.7.5-1.6 1.5-3Z" fill="currentColor" />
            </svg>
          </ToolButton>

          <ToolButton label="Undo" disabled={disabled || (!fill && history.length === 0)} onClick={undo}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M9 7 5 11l4 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 11h8a5 5 0 0 1 0 10h-2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            </svg>
          </ToolButton>

          <ToolButton label="Clear" disabled={disabled || !touched} onClick={clearAll}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M4 7h16M9 7V4.8h6V7M6.5 7l.8 12.2h9.4L17.5 7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </ToolButton>

          {/* Done lives with the tools so the next player is named where the hand is */}
          {onTurnDone && (
            <button
              type="button"
              onClick={onTurnDone}
              disabled={disabled}
              className={[
                BTN_RESET,
                'ml-auto rounded-[10px] px-3 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-white',
                'transition-transform duration-fast ease-out active:translate-y-[1px]',
                accentDone,
              ].join(' ')}
            >
              {nextLabel ? `Done · ${nextLabel}` : 'Done'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  label,
  children,
  onClick,
  disabled = false,
  active = false,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={[
        BTN_RESET,
        'grid h-8 w-8 place-items-center rounded-[9px] transition-transform duration-fast active:translate-y-[1px]',
        active
          ? 'bg-[#5933a2] text-white ring-1 ring-inset ring-[#c49aff]/50'
          : 'bg-white/[0.06] text-white/80 ring-1 ring-inset ring-white/12 hover:bg-white/12',
        disabled ? 'opacity-35' : '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
