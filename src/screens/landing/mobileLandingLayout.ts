import { WAVE_HEIGHT_MOBILE } from "@/components/landing/WaveDecoration";
import {
  mobileAuthCardHeight,
  mobileAuthCardMetrics,
} from "@/features/auth/components/authCardMetrics";
import { lerpRound, progress } from "@/utils/responsive";

export const TIGHT_VIEWPORT_HEIGHT = 540;

export const SPACIOUS_VIEWPORT_HEIGHT = 780;

const WAVE_HEIGHT_TIGHT = 56;
const LOGO_SIZE_TIGHT = 48;
const LOGO_SIZE_SPACIOUS = 66;
const TITLE_SIZE_TIGHT = 26;
const TITLE_SIZE_SPACIOUS = 35;
const BRAND_PADDING_TOP_TIGHT = 8;
const BRAND_PADDING_TOP_SPACIOUS = 16;

const BOTTOM_SPACING_TIGHT = 12;
const BOTTOM_SPACING_SPACIOUS = 20;

const GESTURE_CLEARANCE_TIGHT = 6;
const GESTURE_CLEARANCE_SPACIOUS = 10;

const WAVE_OVERLAP_RATIO = 0.34;

const CARD_CHROME_ALLOWANCE = 8;

export type MobileLandingViewport = {
  width: number;
  height: number;
  designHeight: number;
  insets: { top: number; bottom: number };
  fontScale: number;
};

export type MobileLandingLayout = ReturnType<typeof computeMobileLandingLayout>;

export const computeMobileLandingLayout = ({
  width,
  height,
  designHeight,
  insets,
  fontScale,
}: MobileLandingViewport) => {
  const availableHeight = designHeight - insets.top - insets.bottom;
  const density = progress(
    availableHeight,
    TIGHT_VIEWPORT_HEIGHT,
    SPACIOUS_VIEWPORT_HEIGHT,
  );

  const scale = (tight: number, spacious: number) => lerpRound(tight, spacious, density);

  const cardMetrics = mobileAuthCardMetrics(density);
  const cardHeight =
    mobileAuthCardHeight(cardMetrics, fontScale) + CARD_CHROME_ALLOWANCE;

  const waveHeight = scale(WAVE_HEIGHT_TIGHT, WAVE_HEIGHT_MOBILE);
  const cardOverlap = Math.round(waveHeight * WAVE_OVERLAP_RATIO);
  const logoSize = scale(LOGO_SIZE_TIGHT, LOGO_SIZE_SPACIOUS);
  const brandPaddingTop = scale(BRAND_PADDING_TOP_TIGHT, BRAND_PADDING_TOP_SPACIOUS);

  const bottomSpacing = Math.max(
    insets.bottom + scale(GESTURE_CLEARANCE_TIGHT, GESTURE_CLEARANCE_SPACIOUS),
    scale(BOTTOM_SPACING_TIGHT, BOTTOM_SPACING_SPACIOUS),
  );

  const heroFloor = insets.top + logoSize + waveHeight;
  const preferredHeroHeight = insets.top + brandPaddingTop * 2 + logoSize + waveHeight;

  const stackedHeight = (hero: number) => hero + cardHeight - cardOverlap + bottomSpacing;

  const heroOverflow = Math.max(0, stackedHeight(preferredHeroHeight) - height);
  const heroMinHeight = Math.max(heroFloor, preferredHeroHeight - heroOverflow);

  const minimumContentHeight = stackedHeight(heroMinHeight);

  const fitsWithoutScrolling = height >= minimumContentHeight;

  return {
    density,
    availableHeight,
    gutter: width < 360 ? 14 : width < 400 ? 16 : 20,
    bottomSpacing,
    hero: {
      minHeight: heroMinHeight,
      paddingTop: insets.top + brandPaddingTop,
      paddingBottom: waveHeight,
      waveHeight,
    },
    brand: {
      logoSize,
      titleFontSize: scale(TITLE_SIZE_TIGHT, TITLE_SIZE_SPACIOUS),
    },
    card: {
      overlap: cardOverlap,
      estimatedHeight: cardHeight,
      metrics: cardMetrics,
    },
    fitsWithoutScrolling,
    minimumContentHeight,
  };
};
