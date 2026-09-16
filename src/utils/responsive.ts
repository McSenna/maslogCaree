export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const lerp = (from: number, to: number, t: number): number =>
  from + (to - from) * t;

export const lerpRound = (from: number, to: number, t: number): number =>
  Math.round(lerp(from, to, t));

export const progress = (value: number, from: number, to: number): number =>
  to === from ? 1 : clamp((value - from) / (to - from), 0, 1);
