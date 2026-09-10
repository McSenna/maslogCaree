/**
 * `#2D5BFF` → `rgba(45,91,255,0.18)`.
 *
 * Used for tinted shadows, where the colour is a data value rather than a
 * design token and cannot be written as an rgba literal up front. Falls back
 * to transparent black on anything that is not a six-digit hex.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return `rgba(0,0,0,${alpha})`;

  const red = parseInt(normalized.slice(0, 2), 16);
  const green = parseInt(normalized.slice(2, 4), 16);
  const blue = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}
