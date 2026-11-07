import { Platform } from "react-native";

import type { LearnMoreTone } from "@/config/learnMoreContent";
import { PALETTE } from "@/theme/palette";

const { blue, green, orange } = PALETTE;

export const TONE_PALETTE: Record<LearnMoreTone, { bg: string; fg: string; border: string }> = {
  primary: { bg: blue[50], fg: blue[700], border: blue[200] },
  care: { bg: green[50], fg: green[700], border: green[200] },
  accent: { bg: orange[50], fg: orange[700], border: orange[200] },
};

export const ABOUT_RADIUS = {
  modal: 22,
  card: 16,
  image: 18,
  chip: 999,
} as const;

export const CONTENT_GUTTER = { compact: 18, wide: 26 } as const;

/**
 * The About text holds no links or buttons, so its scroll area takes focus
 * itself on web; otherwise a keyboard user could not scroll it.
 */
export const ABOUT_SCROLL_A11Y = {
  accessibilityLabel: "About MaslogCare details",
  focusable: true,
  ...Platform.select({ web: { role: "region", tabIndex: 0 } as object }),
};
