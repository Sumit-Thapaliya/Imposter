/**
 * Paint bucket for a board that has no canvas.
 *
 * A browser gets `ctx.getImageData` and a flood fill for free. React Native has neither:
 * the board is a list of SVG paths, and SVG has no idea which pixels are inside a shape.
 *
 * So this file rebuilds a small raster from the stroke list, floods it, and emits the
 * result as rectangles the SVG can draw. It is deliberately pure and dependency-free:
 * given strokes in and a seed point, the same rectangles come out every time — which is
 * exactly what `kind: 'fill'` needs, because the server only ships the seed and every
 * client works out the shape for itself.
 *
 * The grid is normalised (0..1 in, cell indices internally) so a fill survives rotation,
 * the expanded board, and a different phone screen without being re-seeded.
 */

import type { Stroke } from './DrawingBoard';

/** Cell coordinates in grid space. */
export type Grid = { width: number; height: number };

/**
 * How many cells the short side of the board gets.
 *
 * 96 is the compromise: fine strokes (3px) stay ~1.5 cells wide so outlines still close,
 * while a full-board fill costs ~12k cells — a couple of milliseconds, not a jank frame.
 */
export const GRID_SHORT_SIDE = 96;

/** Work out a grid that matches the board's aspect ratio. */
export function gridFor(boxWidth: number, boxHeight: number): Grid {
  if (boxWidth <= 0 || boxHeight <= 0) return { width: GRID_SHORT_SIDE, height: GRID_SHORT_SIDE };
  if (boxWidth >= boxHeight) {
    return {
      width: Math.round((GRID_SHORT_SIDE * boxWidth) / boxHeight),
      height: GRID_SHORT_SIDE,
    };
  }
  return {
    width: GRID_SHORT_SIDE,
    height: Math.round((GRID_SHORT_SIDE * boxHeight) / boxWidth),
  };
}

/** A filled rectangle in normalised board space, carrying the colour it was filled with. */
export type FillRect = { x: number; y: number; w: number; h: number; color: string };

const EMPTY = 0;
const INK = 1;

/**
 * Close an outline that ends near where it started.
 *
 * A finger never lands exactly on its first point, so a drawn loop usually has a gap of a
 * percent or two — and a flood fill escapes through it and colours the whole board, which
 * reads as a bug even though the maths is right. Treating an end point within 2% of the
 * start as "closed" is what every phone drawing app does, and it is the difference between
 * the bucket working on the first tap and the player having to hunt for the leak.
 */
function closeIfNearlyClosed(points: number[]): { points: number[]; closed: boolean } {
  if (points.length < 6) return { points, closed: false };
  const firstX = points[0]!;
  const firstY = points[1]!;
  const lastX = points[points.length - 2]!;
  const lastY = points[points.length - 1]!;
  const near = Math.hypot(lastX - firstX, lastY - firstY) <= 0.02;
  if (!near) return { points, closed: false };
  /** Closing the real stroke (not just this copy) keeps the line and the bounds in step. */
  return { points: [...points, firstX, firstY], closed: true };
}

/**
 * Draw one stroke into the ink mask.
 *
 * Consecutive points are joined by *sampling along the segment*, not by stamping the two
 * endpoints. Stamping only the points is what makes a flood fill leak: a fast finger
 * leaves points several cells apart, the outline gets holes, and the fill escapes through
 * them and floods the entire board. Sampling every half cell closes the line no matter how
 * quickly the player moved.
 */
function stampStroke(
  mask: Uint8Array,
  grid: Grid,
  stroke: Stroke,
  boxHeight: number,
): void {
  const { width, height } = grid;
  const points = closeIfNearlyClosed(stroke.points).points;
  if (points.length < 2) return;

  /** Stroke width is in board pixels; convert to cells using the measured board height. */
  const cellsPerPixel = boxHeight > 0 ? height / boxHeight : 0;
  const radius = Math.max(0.5, (Math.max(1, stroke.size) * cellsPerPixel) / 2);

  const plot = (px: number, py: number) => {
    const cx = px * width;
    const cy = py * height;
    const r = Math.ceil(radius);
    const x0 = Math.max(0, Math.floor(cx - r));
    const x1 = Math.min(width - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r));
    const y1 = Math.min(height - 1, Math.ceil(cy + r));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy <= radius * radius + 0.25) mask[y * width + x] = INK;
      }
    }
  };

  if (points.length === 2) {
    plot(points[0]!, points[1]!);
    return;
  }

  for (let i = 0; i + 3 < points.length; i += 2) {
    const ax = points[i]!, ay = points[i + 1]!;
    const bx = points[i + 2]!, by = points[i + 3]!;
    /** Step along the segment in cell units, never finer than half a cell. */
    const dxCells = (bx - ax) * width;
    const dyCells = (by - ay) * height;
    const steps = Math.max(1, Math.ceil(Math.hypot(dxCells, dyCells) * 2));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      plot(ax + (bx - ax) * t, ay + (by - ay) * t);
    }
  }
  /** The final point is not covered by the loop above when the count is odd. */
  const lastX = points[points.length - 2]!;
  const lastY = points[points.length - 1]!;
  plot(lastX, lastY);
}

/**
 * Four-way flood fill from a normalised seed, in place on `mask`.
 * Returns the cells it consumed, or null when the seed is already ink.
 */
function flood(mask: Uint8Array, grid: Grid, seedX: number, seedY: number): Uint8Array | null {
  const { width, height } = grid;
  const sx = Math.min(width - 1, Math.max(0, Math.floor(seedX * width)));
  const sy = Math.min(height - 1, Math.max(0, Math.floor(seedY * height)));
  const start = sy * width + sx;
  if (mask[start] === INK) return null;

  const filled = new Uint8Array(width * height);
  const stack: number[] = [start];
  while (stack.length) {
    const index = stack.pop()!;
    if (index < 0 || index >= mask.length) continue;
    if (mask[index] === INK || filled[index] === 1) continue;
    filled[index] = 1;
    const x = index % width;
    if (x > 0) stack.push(index - 1);
    if (x < width - 1) stack.push(index + 1);
    if (index >= width) stack.push(index - width);
    if (index + width < mask.length) stack.push(index + width);
  }
  return filled;
}

/**
 * Merge filled cells into as few rectangles as possible.
 *
 * Left-to-right runs first, then identical runs stacked vertically are glued together.
 * A plain background fill collapses to a single rect instead of ~12 000 of them, which is
 * the difference between one SVG node and a board that stalls.
 */
function toRects(filled: Uint8Array, grid: Grid, color: string): FillRect[] {
  const { width, height } = grid;
  /**
   * runAt[y * width + x] = length of the filled run that *starts* at x and extends right.
   *
   * Only the leftmost cell of a run carries a length. The first version of this walked
   * right-to-left and stored the length at each run's rightmost cell, which made every
   * rectangle start at the wrong column and spill past the edge of the board.
   */
  const runAt: number[] = new Array(width * height).fill(0);
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      if (filled[y * width + x] === 1) {
        let run = 1;
        while (x + run < width && filled[y * width + x + run] === 1) run++;
        runAt[y * width + x] = run;
        x += run;
      } else {
        x++;
      }
    }
  }

  const used = new Uint8Array(width * height);
  const rects: FillRect[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const run = runAt[index] ?? 0;
      if (run === 0 || used[index] === 1) continue;
      /** How many rows below carry the exact same run at this exact column. */
      let rows = 1;
      while (
        y + rows < height &&
        (runAt[(y + rows) * width + x] ?? 0) === run &&
        used[(y + rows) * width + x] === 0
      ) {
        rows++;
      }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < run; c++) used[(y + r) * width + x + c] = 1;
      }
      rects.push({
        x: x / width,
        y: y / height,
        w: Math.min(run, width - x) / width,
        h: Math.min(rows, height - y) / height,
        color,
      });
    }
  }
  return rects;
}

/**
 * Apply every fill in the stroke list, in order, and return the rectangles to draw.
 *
 * A fill that lands in a later stroke sees the earlier fills, because they are stamped
 * into the mask as solid ink — so you can fill a shape, then fill the shape next to it,
 * and each respects the other's boundary. That matches the browser's behaviour.
 */
export function fillRects(
  strokes: Stroke[],
  grid: Grid,
  boxHeight: number,
): FillRect[] {
  const mask = new Uint8Array(grid.width * grid.height);
  const out: FillRect[] = [];

  for (const stroke of strokes) {
    if (stroke.kind === 'fill') {
      const seedX = stroke.points[0] ?? 0;
      const seedY = stroke.points[1] ?? 0;
      const filled = flood(mask, grid, seedX, seedY);
      if (!filled) continue;
      /** The fill becomes solid ink so the next fill cannot pass through it. */
      for (let i = 0; i < filled.length; i++) if (filled[i] === 1) mask[i] = INK;
      out.push(...toRects(filled, grid, stroke.color));
    } else {
      stampStroke(mask, grid, stroke, boxHeight);
    }
  }
  return out;
}
