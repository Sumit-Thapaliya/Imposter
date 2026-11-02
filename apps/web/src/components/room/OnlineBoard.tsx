'use client';

/**
 * The shared board for ONLINE drawing rooms.
 *
 * One canvas that every player adds to in turn. Points are sent normalised (0..1) so
 * a phone and a laptop draw at the same place on the picture regardless of canvas
 * size. Finished strokes are echoed back by the server; the finger that is currently
 * down is streamed live so the others watch it appear.
 *
 * Colour and brush size only — same constraint as the local pad.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { BTN_RESET } from '@/components/local/controls';
import { getSocket, send } from '@/lib/rooms/socket';
import type { RoomState, Stroke } from '@shared/contract';

const COLORS = [
  '#FFFFFF',
  '#111827',
  '#F472B6',
  '#A78BFA',
  '#34D399',
  '#FBBF24',
  '#60A5FA',
] as const;

const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[2px] focus-visible:outline-[#FDE68A]';

function paint(
  ctx: CanvasRenderingContext2D,
  points: number[],
  color: string,
  size: number,
  width: number,
  height: number,
) {
  if (points.length < 4) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0]! * width, points[1]! * height);
  for (let i = 2; i < points.length; i += 2) {
    ctx.lineTo(points[i]! * width, points[i + 1]! * height);
  }
  ctx.stroke();
}

export function OnlineBoard({ state, canDraw }: { state: RoomState; canDraw: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const points = useRef<number[]>([]);
  const live = useRef<{ points: number[]; color: string; size: number } | null>(null);
  const [color, setColor] = useState<string>(COLORS[0]);
  const [size, setSize] = useState(6);
  const [touched, setTouched] = useState(false);

  const fit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // repaint everything the server knows about, plus any live finger
    ctx.clearRect(0, 0, rect.width, rect.height);
    for (const stroke of state.strokes) {
      paint(ctx, stroke.points, stroke.color, stroke.size, rect.width, rect.height);
    }
    if (live.current) {
      paint(ctx, live.current.points, live.current.color, live.current.size, rect.width, rect.height);
    }
    if (state.strokes.length > 0) setTouched(true);
  }, [state.strokes]);

  useEffect(() => {
    fit();
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [fit]);

  // Remote strokes: the committed ones arrive in state; the in-progress one streams.
  useEffect(() => {
    const socket = getSocket();
    const onStroke = (stroke: Stroke) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      paint(ctx, stroke.points, stroke.color, stroke.size, rect.width, rect.height);
      setTouched(true);
    };
    const onLive = (payload: { points: number[]; color: string; size: number }) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      live.current = payload;
      paint(ctx, payload.points, payload.color, payload.size, rect.width, rect.height);
      setTouched(true);
    };
    const onClear = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      live.current = null;
      setTouched(false);
    };

    socket.on('draw:stroke', onStroke);
    socket.on('draw:live', onLive);
    socket.on('draw:clear', onClear);
    return () => {
      socket.off('draw:stroke', onStroke);
      socket.off('draw:live', onLive);
      socket.off('draw:clear', onClear);
    };
  }, []);

  function point(event: React.PointerEvent<HTMLCanvasElement>): [number, number] {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  }

  function down(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!canDraw) return;
    const canvas = event.currentTarget;
    canvas.setPointerCapture(event.pointerId);
    drawing.current = true;
    points.current = [...point(event)];
    setTouched(true);
  }

  function move(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !canDraw) return;
    const [x, y] = point(event);
    points.current.push(x, y);

    const canvas = event.currentTarget;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const tail = points.current.slice(-4);
      paint(ctx, tail, color, size, rect.width, rect.height);
    }
    // Throttled by nature of pointer events; the server batches nothing.
    getSocket().emit('draw:live', { points: points.current.slice(-8), color, size });
  }

  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    const stroke = { points: points.current, color, size };
    points.current = [];
    if (stroke.points.length >= 4) void send('draw:stroke', stroke);
  }

  return (
    <div className="rounded-[16px] bg-[#0F0822]/95 p-2.5 ring-1 ring-inset ring-white/12">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[#C4B5FD]">
          {canDraw ? 'Your turn — draw' : 'Shared board'}
        </span>
        <span className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white/40">
          {state.strokes.length} stroke{state.strokes.length === 1 ? '' : 's'}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        className="block h-[clamp(160px,26dvh,240px)] w-full touch-none rounded-[12px] bg-[#171029] ring-1 ring-inset ring-white/12"
        aria-label="Shared drawing board"
      />

      {canDraw && (
        <>
          {/* grid, not flex: spacing.7 is 48px in this project */}
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => setColor(swatch)}
                aria-label={`Colour ${swatch}`}
                aria-pressed={color === swatch}
                className={[
                  BTN_RESET,
                  'aspect-square w-full rounded-full ring-2 transition-transform duration-fast ease-out active:scale-95',
                  color === swatch ? 'ring-white' : 'ring-white/20',
                  FOCUS,
                ].join(' ')}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.1em] text-white/50">
              Brush
            </span>
            <input
              type="range"
              min={2}
              max={24}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              aria-label="Brush size"
              className="min-w-0 flex-1 accent-[#A78BFA]"
            />
            <span className="w-5 text-right text-[0.7rem] font-extrabold tabular-nums text-white/70">
              {size}
            </span>
          </div>
        </>
      )}

      {!canDraw && (
        <p className="m-0 mt-1.5 text-center text-[0.66rem] font-bold uppercase tracking-[0.08em] text-white/40">
          {touched ? 'One picture — waiting for your turn' : 'Waiting for the first stroke…'}
        </p>
      )}
    </div>
  );
}
