'use client';
import styles from './drawing.module.css';

export const COLORS = ['#ffffff', '#171029', '#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6'] as const;
export const BACKGROUND = '#171029';
type Props = { color: string; setColor: (value: string) => void; size: number; setSize: (value: number) => void; eraser: boolean; setEraser: (value: boolean) => void; disabled?: boolean; undo?: () => void; clear?: () => void; fill?: () => void; filling?: boolean; canUndo?: boolean };
export function DrawingTools({ color, setColor, size, setSize, eraser, setEraser, disabled, undo, clear, fill, filling = false, canUndo }: Props) {
  return <div className={styles.tools}>
    <div className={styles.toolRow} role="group" aria-label="Drawing tools">
      <button type="button" className={styles.tool} aria-label="Brush" aria-pressed={!eraser && !filling} disabled={disabled} onClick={() => setEraser(false)}>✎ <span>Brush</span></button>
      <button type="button" className={styles.tool} aria-label="Eraser" aria-pressed={eraser && !filling} disabled={disabled} onClick={() => setEraser(true)}>▱ <span>Eraser</span></button>
      {undo && <button type="button" className={styles.tool} aria-label="Undo" disabled={disabled || !canUndo} onClick={undo}>↶ <span>Undo</span></button>}
      {fill && <button type="button" className={styles.tool} aria-label="Fill" aria-pressed={filling} disabled={disabled} onClick={fill}>◧ <span>Fill</span></button>}
      {clear && <button type="button" className={styles.tool} aria-label="Clear" disabled={disabled} onClick={clear}>⌫ <span>Clear</span></button>}
    </div>
    <div className={styles.bottomRow}><div className={styles.colors} role="group" aria-label="Brush colors">{COLORS.map((swatch, i) => <button key={swatch} type="button" disabled={disabled} aria-label={`Color ${['white', 'dark', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'][i]}`} aria-pressed={color === swatch} className={styles.swatch} style={{ '--swatch': swatch } as React.CSSProperties} onClick={() => { setColor(swatch); if (!filling) setEraser(false); }} />)}</div>
      <label className={styles.size}>Size <input aria-label="Brush size" type="range" min="2" max="32" value={size} disabled={disabled} onChange={event => setSize(Number(event.target.value))} /><output>{size}</output></label>
    </div>
  </div>;
}
