import type { Stroke } from '@shared/contract';
export type { Stroke };
/** Prepare a sharp canvas without stretching coordinates on high-density displays. */
export function fitCanvas(canvas: HTMLCanvasElement): boolean {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * ratio), height = Math.round(rect.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
  return true;
}
export function paintStroke(canvas: HTMLCanvasElement, stroke: Stroke) {
  if (stroke.kind === 'fill') { floodFill(canvas, stroke.points, stroke.color); return; }
  const ctx = canvas.getContext('2d'); if (!ctx || stroke.points.length < 4) return;
  const rect = canvas.getBoundingClientRect();
  ctx.strokeStyle = stroke.color; ctx.lineWidth = stroke.size * rect.width / 400; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(stroke.points[0]! * rect.width, stroke.points[1]! * rect.height);
  for (let i = 2; i + 1 < stroke.points.length; i += 2) ctx.lineTo(stroke.points[i]! * rect.width, stroke.points[i + 1]! * rect.height);
  ctx.stroke();
}
export function repaint(canvas: HTMLCanvasElement, strokes: Stroke[]) {
  if (!fitCanvas(canvas)) return;
  const rect = canvas.getBoundingClientRect(); canvas.getContext('2d')?.clearRect(0, 0, rect.width, rect.height);
  for (const stroke of strokes) paintStroke(canvas, stroke);
}
export function pointerPoint(event: { clientX: number; clientY: number }, canvas: HTMLCanvasElement): number[] {
  const rect = canvas.getBoundingClientRect();
  return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))];
}

/** Flood a single connected area. Four-way traversal keeps closed outlines intact. */
export function floodFill(canvas: HTMLCanvasElement, point: number[], color: string): boolean {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || !canvas.width || !canvas.height || !/^#[0-9a-f]{6}$/i.test(color)) return false;
  const w = canvas.width, h = canvas.height;
  const x = Math.min(w - 1, Math.max(0, Math.floor((point[0] ?? 0) * w)));
  const y = Math.min(h - 1, Math.max(0, Math.floor((point[1] ?? 0) * h)));
  const img = ctx.getImageData(0, 0, w, h), data = img.data, start = (y * w + x) * 4;
  const target = Array.from(data.slice(start, start + 4));
  const fill = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16), 255];
  if (target.every((v, i) => v === fill[i])) return false;
  // Track visited pixels separately so similar target and replacement colors cannot loop.
  const visited = new Uint8Array(w * h); const stack: number[] = [y * w + x];
  function matches(pixel: number) {
    const i = pixel * 4;
    return !visited[pixel] && target.every((value, channel) => Math.abs(data[i + channel]! - value) <= 18);
  }
  while (stack.length) {
    const seed = stack.pop()!; if (!matches(seed)) continue;
    const row = Math.floor(seed / w); let left = seed % w;
    while (left > 0 && matches(row * w + left - 1)) left--;
    let above = false, below = false;
    for (let col = left; col < w && matches(row * w + col); col++) {
      const index = row * w + col, offset = index * 4; visited[index] = 1;
      data[offset] = fill[0]!; data[offset + 1] = fill[1]!; data[offset + 2] = fill[2]!; data[offset + 3] = 255;
      if (row > 0) { const hit = matches(index - w); if (hit && !above) stack.push(index - w); above = hit; }
      if (row + 1 < h) { const hit = matches(index + w); if (hit && !below) stack.push(index + w); below = hit; }
    }
  }
  ctx.putImageData(img, 0, 0); return true;
}
