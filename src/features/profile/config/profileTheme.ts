import { PALETTE, withAlpha } from "@/theme/palette";

export const PROFILE_COLORS = {
  primary: PALETTE.blue[600],
  primarySoft: PALETTE.blue[50],
  primaryBorder: PALETTE.blue[200],
  green: PALETTE.success[500],
  greenDeep: PALETTE.success[600],
  greenSoft: PALETTE.success[50],
  background: PALETTE.slate[50],
  surface: PALETTE.white,
  heading: PALETTE.slate[800],
  navy: PALETTE.slate[800],
  body: PALETTE.slate[700],
  muted: PALETTE.slate[600],
  subtle: PALETTE.slate[500],
  border: PALETTE.slate[200],
  divider: PALETTE.slate[100],
  danger: PALETTE.red[600],
  dangerSoft: PALETTE.red[50],
  dangerBorder: PALETTE.red[200],
} as const;

export const PROFILE_RADIUS = {
  card: 20,
  hero: 22,
  modal: 22,
  control: 12,
  pill: 999,
} as const;

export const PROFILE_TYPE = {
  modalTitle: 29,
  screenTitle: 24,
  name: 27,
  nameCompact: 24,
  sectionTitle: 20,
  label: 15.5,
  value: 16.5,
  meta: 14.5,
} as const;

export const PROFILE_SHADOW = {
  card: {
    boxShadow: `0px 1px 3px ${withAlpha(PALETTE.ink, 0.05)}`,
    elevation: 1,
  },
  raised: {
    boxShadow: `0px 8px 24px ${withAlpha(PALETTE.ink, 0.08)}`,
    elevation: 6,
  },
  modal: {
    boxShadow: `0px 24px 64px ${withAlpha(PALETTE.ink, 0.22)}`,
    elevation: 24,
  },
} as const;
