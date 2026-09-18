import { createShadow } from "./shadow";
export const CARD_SHADOW = createShadow({
  color: "#0F172A",
  opacity: 0.04,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});

export const CONTROL_HEIGHT = 48;

export const RADIUS = {
  card: 16,
  panel: 14,
  control: 10,
  pill: 9999,
} as const;

export type BadgeTone = {
  label: string;
  text: string;
  bg: string;
  dot?: string;
};
