import { createShadow } from "./shadow";

export const CARD_SHADOW = createShadow({
  color: "#0F172A",
  opacity: 0.04,
  radius: 12,
  offsetY: 2,
  elevation: 1,
});

export const MODAL_SHADOW = {
  ...createShadow({
    color: "#0F172A",
    opacity: 0.12,
    radius: 24,
    offsetY: 16,
    elevation: 16,
  }),
  boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.05)",
};

export const MODAL_BACKDROP_LIGHT = "rgba(15, 23, 42, 0.20)"; // bg-slate-900/20
export const MODAL_BACKDROP_DARK = "rgba(15, 23, 42, 0.45)";

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
