export const CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
} as const;

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
