/**
 * Splash-screen palette.
 *
 * Kept beside the screen rather than in the landing tokens because these values
 * also drive animated styles and decorative fills, where a NativeWind class
 * does not reach. The blues match `LANDING_COLORS` so the splash and the page
 * it hands over to read as one product.
 */
export const SPLASH_COLORS = {
  /** Page wash — very light blue at the top, white through the middle. */
  skyTop: "#E8F1FB",
  skyMid: "#F4F9FD",
  base: "#FFFFFF",
  /** "Maslog" in the wordmark. */
  brandBlue: "#0B4F9E",
  /** "Care" in the wordmark. */
  brandGreen: "#2E8B41",
  tagline: "#4A6580",
  /** PEOPLE • HEALTH • COMMUNITY */
  eyebrow: "#8CA0B8",
  loadingText: "#7A8DA3",
  dot: "#3B82F6",
  /** Decorative silhouettes — deliberately near-invisible. */
  mountain: "#CFE0F0",
  foliage: "#CFE4D6",
  cloud: "#FFFFFF",
} as const;

/** Entrance timings, inside the brief's 500–900ms budget. */
export const SPLASH_TIMING = {
  fadeIn: 600,
  logoIn: 700,
  wordmarkIn: 500,
  wordmarkDelay: 250,
  /** One dot's full pulse; the three are offset by a third of it. */
  dotCycle: 900,
  /** How long the splash stays up even when startup finishes instantly. */
  minimumVisible: 1800,
  /** Cross-fade out to the landing page. */
  fadeOut: 350,
} as const;
