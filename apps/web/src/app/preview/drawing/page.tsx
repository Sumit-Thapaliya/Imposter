import Link from 'next/link';
import { DrawingPad } from '@/components/local/DrawingPad';

/** A quick way to try the shared drawing tools without starting a game. */
export default function DrawingPreviewPage() {
  return <main style={{ minHeight: '100dvh', background: '#100922', color: 'white', padding: '24px 16px', display: 'grid', placeItems: 'center' }}>
    <div style={{ width: 'min(100%, 1000px)' }}>
      <p style={{ color: '#d6baff', fontSize: 13, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>DRAWING PREVIEW</p>
      <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', margin: '0 0 8px' }}>Try the drawing board</h1>
      <p style={{ color: '#c5b8db', fontSize: 15, marginBottom: 20 }}>Draw with your finger, stylus, or mouse. This preview shows the local board; online uses the same brush tools.</p>
      <DrawingPad accent="violet" turnLabel="Preview" />
      <p style={{ color: '#b5a4ce', fontSize: 13, lineHeight: 1.5 }}>Undo, fill, and clear are currently available in local mode. <Link href="/play-type" style={{ color: '#dfc5ff' }}>Open the full game →</Link></p>
    </div>
  </main>;
}
