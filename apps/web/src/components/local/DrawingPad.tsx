'use client';

import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { BTN_RESET } from './controls';

/**
 * Simple drawing pad — one brush + a colour row + fill-the-canvas.
 *
 * Deliberately small: a single round brush whose width is set by a slider, seven
 * preset colours and a "fill" that floods the whole canvas with the current colour.
 * No layers, no undo history beyond one step, no shapes — those can come later.
 *
 * Pointer Events, so finger, stylus and mouse all work through the same code. The
 * canvas is sized to its CSS box times devicePixelRatio on mount/resize so strokes
 * stay sharp instead of blurring.
 */

const COLORS = ['#FFFFFF', '#111827', '#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#60A5FA'] as const;

export function DrawingPad({
  accent,
  disabled = false,
  className = '',
  keepContent = false,
  turnLabel,
}: {
  accent: 'violet' | 'orange';
  disabled?: boolean;
  className?: string;
  /**
   * Shared-panel mode: the pad is hidden between players rather than unmounted, so
   * whatever the previous player drew is still there when the next one takes over.
   */
  keepContent?: boolean;
  /** Shown as a chip in the corner, e.g. "Player 3". */
  turnLabel?: string;
}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState<string>('#FFFFFF');
  const [size, setSize] = useState(6);
  const [touched, setTouched] = useState(false);

  /** Re-size the backing store to the element's box × DPR, keeping an optional snapshot. */
  const syncSize = useCallback((snapshot?: ImageData | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(rect.width * dpr);
    const height = Math.round(rect.height * dpr);
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (snapshot) ctx.putImageData(snapshot, 0, 0);
  }, []);

  /* A fresh pad starts blank; a shared pad must keep what is already on it. */
  useEffect(() => {
    if (keepContent) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [keepContent]);

  useEffect(() => {
    syncSize();
    const onResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let snapshot: ImageData | null = null;
      const ctx = canvas.getContext('2d');
      if (ctx && canvas.width > 0) snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      syncSize(snapshot);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [syncSize]);

  /** Point in CSS pixels relative to the canvas box. */
  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function stroke(from: { x: number; y: number } | null, to: { x: number; y: number }) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    if (from) ctx.moveTo(from.x, from.y);
    else {
      // a tap should still leave a dot
      ctx.moveTo(to.x - 0.01, to.y);
    }
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function onDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const p = point(event);
    lastRef.current = p;
    stroke(null, p);
    setTouched(true);
  }

  function onMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || disabled) return;
    const p = point(event);
    stroke(lastRef.current, p);
    lastRef.current = p;
  }

  function endStroke() {
    drawingRef.current = false;
    lastRef.current = null;
  }

  function fillCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, rect.width, rect.height);
    setTouched(true);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setTouched(false);
  }

  const accentRing = accent === 'violet' ? 'ring-[#A78BFA]/40' : 'ring-[#FB923C]/40';
  const accentBtn =
    accent === 'violet'
      ? 'bg-[linear-gradient(170deg,#A78BFA_0%,#7C3AED_100%)] shadow-[0_3px_0_#4C1D95]'
      : 'bg-[linear-gradient(170deg,#FB923C_0%,#EA580C_100%)] shadow-[0_3px_0_#7C2D12]';

  return (
    <div
      className={[
        'w-full rounded-[18px] bg-[#0B0618]/92 p-2.5 ring-1 ring-inset ring-white/14',
        'shadow-[0_14px_34px_rgba(0,0,0,0.5)]',
        className,
      ].join(' ')}
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
          onPointerCancel={endStroke}
          aria-label="Drawing area"
          className={[
            'block h-[clamp(150px,26dvh,230px)] w-full touch-none rounded-[13px] bg-[#171029]',
            'ring-1 ring-inset',
            accentRing,
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-crosshair',
          ].join(' ')}
          style={{ touchAction: 'none' }}
        />
        {turnLabel && (
          <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-[#120A26]/85 px-2.5 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.1em] text-white/85 ring-1 ring-inset ring-white/15">
            {turnLabel}
          </span>
        )}
        {!touched && !disabled && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/25">
            Draw here
          </span>
        )}
      </div>

      {/* colours on their own line so seven swatches always fit a phone */}
      {/* grid, not flex: this project redefines spacing.7 as 48px, so fixed swatch sizes overflow */}
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {COLORS.map((hex) => {
          const active = hex === color;
          return (
            <button
              key={hex}
              type="button"
              aria-label={`Colour ${hex}`}
              aria-pressed={active}
              disabled={disabled}
              onClick={() => setColor(hex)}
              className={[
                BTN_RESET,
                'aspect-square w-full rounded-full ring-2 transition-transform duration-fast ease-out',
                active ? 'scale-110 ring-white' : 'ring-white/25 hover:scale-105',
              ].join(' ')}
              style={{ backgroundColor: hex }}
            />
          );
        })}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={fillCanvas}
          disabled={disabled}
          className={[
            BTN_RESET,
            'rounded-[9px] px-2.5 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.06em] text-white',
            'transition-transform duration-fast ease-out active:translate-y-[1px]',
            accentBtn,
          ].join(' ')}
        >
          Fill
        </button>
        <button
          type="button"
          onClick={clearCanvas}
          disabled={disabled}
          className={[
            BTN_RESET,
            'rounded-[9px] bg-white/10 px-2.5 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[0.06em] text-white',
            'ring-1 ring-inset ring-white/14 transition-transform duration-fast ease-out active:translate-y-[1px]',
          ].join(' ')}
        >
          Clear
        </button>

        <label className="ml-1 flex min-w-0 flex-1 items-center gap-2">
          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-white/55">
            Brush
          </span>
          <input
            type="range"
            min={2}
            max={24}
            value={size}
            disabled={disabled}
            onChange={(event) => setSize(Number(event.target.value))}
            className="h-1.5 min-w-0 flex-1 accent-[#A78BFA]"
            aria-label="Brush size"
          />
          <span className="w-5 text-right text-[0.62rem] font-extrabold text-white/70">{size}</span>
        </label>
      </div>
    </div>
  );
}
