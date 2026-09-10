/**
 * Pressable's function-style form (`style={({ pressed }) => ...}`) rendered as
 * an unstyled view on Android in Expo Go — the buttons lost their background
 * and height and became invisible white-on-white text. Plain array styles with
 * explicit press state behave identically on every platform, so the primary
 * actions are never at the mercy of that callback.
 */
export const ANDROID_RIPPLE = { color: "rgba(255, 255, 255, 0.24)" } as const;

/** Airy rhythm for the 1920×1080 desktop card. */
export const DESKTOP_METRICS = {
  headerGap: 34,
  fieldHeight: 60,
  fieldGap: 18,
  formGap: 26,
  buttonHeight: 56,
  afterLoginGap: 20,
  afterForgotGap: 28,
  afterDividerGap: 28,
  afterCreateGap: 24,
  fieldFontSize: 16,
} as const;

/** Reduced desktop rhythm for 1366×768-class viewports. */
export const COMPACT_DESKTOP_METRICS = {
  headerGap: 24,
  fieldHeight: 54,
  fieldGap: 14,
  formGap: 20,
  buttonHeight: 52,
  afterLoginGap: 14,
  afterForgotGap: 20,
  afterDividerGap: 20,
  afterCreateGap: 18,
  fieldFontSize: 15,
} as const;

/** Compact rhythm for Android, within the 48–52px control guidance. */
export const MOBILE_METRICS = {
  headerGap: 20,
  fieldHeight: 52,
  fieldGap: 14,
  formGap: 18,
  buttonHeight: 50,
  afterLoginGap: 12,
  afterForgotGap: 16,
  afterDividerGap: 16,
  afterCreateGap: 16,
  fieldFontSize: 15,
} as const;

/** The vertical rhythm for one viewport class. */
export type AuthCardMetrics = {
  headerGap: number;
  fieldHeight: number;
  fieldGap: number;
  formGap: number;
  buttonHeight: number;
  afterLoginGap: number;
  afterForgotGap: number;
  afterDividerGap: number;
  afterCreateGap: number;
  fieldFontSize: number;
};

/**
 * Vertical rhythm differs between the approved desktop and mobile designs: the
 * desktop card is airy, the mobile card compact so it fits a 360x800 screen
 * without clipping the Create New Account button.
 */
export function authCardMetrics(isMobile: boolean, compact: boolean): AuthCardMetrics {
  if (isMobile) return MOBILE_METRICS;
  return compact ? COMPACT_DESKTOP_METRICS : DESKTOP_METRICS;
}
