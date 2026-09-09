/**
 * MaslogCare profile design tokens.
 *
 * One palette for the web modal and the mobile screen, so the two surfaces are
 * the same product rather than two lookalikes that drift apart.
 */
export const PROFILE_COLORS = {
  primary: "#2563EB",
  primarySoft: "#EFF6FF",
  primaryBorder: "#BFDBFE",
  green: "#10B981",
  greenDeep: "#059669",
  greenSoft: "#ECFDF5",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  heading: "#0F172A",
  /** Deep navy used for names and section titles in the reference design. */
  navy: "#12275C",
  body: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",
  border: "#E2E8F0",
  divider: "#EEF2F7",
  danger: "#EF4444",
  dangerSoft: "#FEF2F2",
  dangerBorder: "#FECACA",
} as const;

export const PROFILE_RADIUS = {
  card: 20,
  hero: 22,
  modal: 22,
  control: 12,
  pill: 999,
} as const;

/** Type scale from §48, expressed in the sizes this app actually renders at. */
export const PROFILE_TYPE = {
  modalTitle: 27,
  screenTitle: 22,
  name: 25,
  nameCompact: 22,
  sectionTitle: 18,
  label: 13.5,
  value: 14.5,
  meta: 12.5,
} as const;

/**
 * Cross-platform soft shadow. `boxShadow` is what react-native-web honours and
 * RN 0.76+ accepts natively; `elevation` covers Android.
 */
export const PROFILE_SHADOW = {
  card: {
    boxShadow: "0px 1px 3px rgba(15, 23, 42, 0.05)",
    elevation: 1,
  },
  raised: {
    boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.08)",
    elevation: 6,
  },
  modal: {
    boxShadow: "0px 24px 64px rgba(15, 23, 42, 0.22)",
    elevation: 24,
  },
} as const;
