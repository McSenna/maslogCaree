export const RADII = {
  small: 8,
  medium: 12,
  large: 16,
  modal: 20,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof RADII;
