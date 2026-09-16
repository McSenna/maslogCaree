import { lerpRound, progress } from "@/utils/responsive";

export const DESKTOP_TIGHT_HEIGHT = 640;

export const DESKTOP_SPACIOUS_HEIGHT = 1040;

export const DESKTOP_MIN_STATIC_HEIGHT = 600;

const WAVE_CLEARANCE_RATIO = 0.72;

export type DesktopLandingViewport = {
  width: number;
  height: number;
  insets: { top: number; bottom: number };
};

export type DesktopLandingLayout = ReturnType<typeof computeDesktopLandingLayout>;

const horizontalPaddingFor = (width: number): number => {
  if (width >= 1780) return 40;
  if (width >= 1400) return 48;
  return 32;
};

export const computeDesktopLandingLayout = ({
  width,
  height,
  insets,
}: DesktopLandingViewport) => {
  const availableHeight = height - insets.top - insets.bottom;
  const density = progress(availableHeight, DESKTOP_TIGHT_HEIGHT, DESKTOP_SPACIOUS_HEIGHT);
  const scale = (tight: number, spacious: number) => lerpRound(tight, spacious, density);

  const isWide = width >= 1500;
  const waveHeight = scale(92, 200);

  return {
    density,
    availableHeight,
    needsScrollFallback: availableHeight < DESKTOP_MIN_STATIC_HEIGHT,

    page: {
      paddingTop: insets.top + scale(16, 28),
      paddingBottom: insets.bottom + scale(12, 24),
      contentMaxWidth: isWide ? 1560 : 1200,
      horizontalPadding: horizontalPaddingFor(width),
      columnGap: scale(12, 24),
    },

    wave: {
      height: waveHeight,
      clearance: Math.round(waveHeight * WAVE_CLEARANCE_RATIO),
    },

    brand: {
      logoSize: scale(64, 110),
      titleFontSize: scale(34, 56),
    },

    headline: {
      headlineSize: scale(30, 46),
      descriptionSize: scale(15, 19),
      gap: scale(8, 12),
    },

    features: {
      iconBox: scale(44, 60),
      iconSize: scale(22, 30),
      titleSize: scale(15.5, 19),
      descriptionSize: scale(13, 15.5),
      rowGap: scale(8, 16),
      rowPadding: scale(6, 10),
      panelGap: scale(10, 16),
      accentWidth: scale(52, 80),
      accentHeight: scale(3, 5),
    },

    actions: {
      buttonHeight: scale(44, 52),
      gap: scale(10, 12),
    },
  };
};
