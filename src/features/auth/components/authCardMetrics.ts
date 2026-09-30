import { SECURITY_NOTICE } from "@/config/landingContent";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import { lerpRound } from "@/utils/responsive";
import {
  COMPACT_DESKTOP_METRICS,
  DESKTOP_METRICS,
  DESKTOP_TIGHT_METRICS,
  MOBILE_METRICS,
  MOBILE_TIGHT_METRICS,
  type AuthCardMetrics,
} from "./authCardMetricPresets";

export {
  COMPACT_DESKTOP_METRICS,
  DESKTOP_METRICS,
  DESKTOP_TIGHT_METRICS,
  MOBILE_METRICS,
  MOBILE_TIGHT_METRICS,
};
export type { AuthCardMetrics };

export const ANDROID_RIPPLE = { color: "rgba(255, 255, 255, 0.24)" } as const;

const METRIC_KEYS = Object.keys(MOBILE_METRICS) as (keyof AuthCardMetrics)[];

const interpolateMetrics = (
  tight: AuthCardMetrics,
  spacious: AuthCardMetrics,
  density: number
): AuthCardMetrics =>
  METRIC_KEYS.reduce((metrics, key) => {
    metrics[key] = lerpRound(tight[key], spacious[key], density);
    return metrics;
  }, {} as AuthCardMetrics);

export const mobileAuthCardMetrics = (density: number): AuthCardMetrics =>
  interpolateMetrics(MOBILE_TIGHT_METRICS, MOBILE_METRICS, density);

export const desktopAuthCardMetrics = (density: number): AuthCardMetrics =>
  interpolateMetrics(DESKTOP_TIGHT_METRICS, DESKTOP_METRICS, density);

const FORGOT_LINK_LINE_HEIGHT = 18;
const FIELD_COUNT = 2;
const DIVIDER_LABEL_LINE_HEIGHT = 17;
export const SECURITY_NOTICE_FONT_SIZE = 12.5;
export const SECURITY_NOTICE_LINE_HEIGHT = 16;
export const EYEBROW_LINE_HEIGHT = TYPE.caption.lineHeight;
export const EYEBROW_PADDING_VERTICAL = SPACING.xs;

const CARD_BORDER = 1;
const SECURITY_ICON_WITH_GAP = 16 + 7;
// Rough average glyph width for the UI sans at this size; errs wide so the
// estimate rounds up to an extra line rather than clipping one.
const AVERAGE_CHAR_WIDTH_RATIO = 0.55;

const securityNoticeLines = (
  metrics: AuthCardMetrics,
  cardWidth: number,
  fontScale: number,
): number => {
  const textWidth =
    cardWidth - 2 * (metrics.paddingHorizontal + CARD_BORDER) - SECURITY_ICON_WITH_GAP;
  const charWidth = SECURITY_NOTICE_FONT_SIZE * fontScale * AVERAGE_CHAR_WIDTH_RATIO;
  const charsPerLine = Math.max(1, Math.floor(textWidth / charWidth));
  return Math.max(1, Math.ceil(SECURITY_NOTICE.length / charsPerLine));
};

export const mobileAuthCardHeight = (
  metrics: AuthCardMetrics,
  fontScale = 1,
  cardWidth = Number.POSITIVE_INFINITY,
): number => {
  const scaleText = (lineHeight: number) => Math.round(lineHeight * fontScale);

  const eyebrowHeight = scaleText(EYEBROW_LINE_HEIGHT) + EYEBROW_PADDING_VERTICAL * 2;

  const headerHeight =
    eyebrowHeight +
    metrics.eyebrowGap +
    scaleText(headingLineHeight(metrics.headingSize)) +
    metrics.headerTextGap +
    scaleText(subtitleLineHeight(metrics.subtitleSize));

  const labelBlockHeight =
    scaleText(labelLineHeight(metrics.labelSize)) + metrics.labelGap;

  const FORGOT_ROW_HEIGHT = 4 + scaleText(FORGOT_LINK_LINE_HEIGHT);
  const DIVIDER_HEIGHT = 4 + scaleText(DIVIDER_LABEL_LINE_HEIGHT);
  const SECURITY_NOTICE_HEIGHT =
    4 +
    Math.max(16, scaleText(SECURITY_NOTICE_LINE_HEIGHT) * securityNoticeLines(metrics, cardWidth, fontScale));

  return (
    metrics.paddingTop +
    headerHeight +
    metrics.headerGap +
    (metrics.fieldHeight + labelBlockHeight) * FIELD_COUNT +
    metrics.fieldGap +
    metrics.formGap +
    metrics.buttonHeight +
    metrics.afterLoginGap +
    FORGOT_ROW_HEIGHT +
    metrics.afterForgotGap +
    DIVIDER_HEIGHT +
    metrics.afterDividerGap +
    metrics.buttonHeight +
    metrics.afterCreateGap +
    SECURITY_NOTICE_HEIGHT +
    metrics.paddingBottom
  );
};

export const headingLineHeight = (fontSize: number) => Math.round(fontSize * 1.22);
export const subtitleLineHeight = (fontSize: number) => Math.round(fontSize * 1.38);
export const labelLineHeight = (fontSize: number) => Math.round(fontSize * 1.3);

export const authCardMetrics = (isMobile: boolean, density = 1): AuthCardMetrics =>
  isMobile ? mobileAuthCardMetrics(density) : desktopAuthCardMetrics(density);
