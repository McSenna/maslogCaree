import { lerpRound } from "@/utils/responsive";
import {
  COMPACT_DESKTOP_METRICS,
  DESKTOP_METRICS,
  MOBILE_METRICS,
  MOBILE_TIGHT_METRICS,
  type AuthCardMetrics,
} from "./authCardMetricPresets";

export { COMPACT_DESKTOP_METRICS, DESKTOP_METRICS, MOBILE_METRICS, MOBILE_TIGHT_METRICS };
export type { AuthCardMetrics };

export const ANDROID_RIPPLE = { color: "rgba(255, 255, 255, 0.24)" } as const;

const METRIC_KEYS = Object.keys(MOBILE_METRICS) as (keyof AuthCardMetrics)[];

export const mobileAuthCardMetrics = (density: number): AuthCardMetrics =>
  METRIC_KEYS.reduce((metrics, key) => {
    metrics[key] = lerpRound(MOBILE_TIGHT_METRICS[key], MOBILE_METRICS[key], density);
    return metrics;
  }, {} as AuthCardMetrics);

const FORGOT_LINK_LINE_HEIGHT = 18;
const DIVIDER_LABEL_LINE_HEIGHT = 17;
const SECURITY_NOTICE_LINE_HEIGHT = 16;

export const mobileAuthCardHeight = (
  metrics: AuthCardMetrics,
  fontScale = 1,
): number => {
  const scaleText = (lineHeight: number) => Math.round(lineHeight * fontScale);

  const headerHeight =
    scaleText(headingLineHeight(metrics.headingSize)) +
    metrics.headerTextGap +
    scaleText(subtitleLineHeight(metrics.subtitleSize));

  const FORGOT_ROW_HEIGHT = 4 + scaleText(FORGOT_LINK_LINE_HEIGHT);
  const DIVIDER_HEIGHT = 4 + scaleText(DIVIDER_LABEL_LINE_HEIGHT);
  const SECURITY_NOTICE_HEIGHT = 4 + Math.max(16, scaleText(SECURITY_NOTICE_LINE_HEIGHT));

  return (
    metrics.paddingTop +
    headerHeight +
    metrics.headerGap +
    metrics.fieldHeight * 2 +
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

export const authCardMetrics = (
  isMobile: boolean,
  compact: boolean,
  density = 1,
): AuthCardMetrics => {
  if (isMobile) return mobileAuthCardMetrics(density);
  return compact ? COMPACT_DESKTOP_METRICS : DESKTOP_METRICS;
};
