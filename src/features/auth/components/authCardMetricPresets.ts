export type AuthCardMetrics = {
  paddingTop: number;
  paddingBottom: number;
  paddingHorizontal: number;
  borderRadius: number;
  headingSize: number;
  subtitleSize: number;
  headerTextGap: number;
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

export const DESKTOP_METRICS: AuthCardMetrics = {
  paddingTop: 54,
  paddingBottom: 44,
  paddingHorizontal: 40,
  borderRadius: 24,
  headingSize: 29,
  subtitleSize: 16,
  headerTextGap: 7,
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
};

export const COMPACT_DESKTOP_METRICS: AuthCardMetrics = {
  paddingTop: 34,
  paddingBottom: 30,
  paddingHorizontal: 32,
  borderRadius: 20,
  headingSize: 25,
  subtitleSize: 15,
  headerTextGap: 7,
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
};

export const MOBILE_METRICS: AuthCardMetrics = {
  paddingTop: 28,
  paddingBottom: 24,
  paddingHorizontal: 22,
  borderRadius: 24,
  headingSize: 25,
  subtitleSize: 15,
  headerTextGap: 7,
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
};

export const MOBILE_TIGHT_METRICS: AuthCardMetrics = {
  paddingTop: 18,
  paddingBottom: 16,
  paddingHorizontal: 20,
  borderRadius: 20,
  headingSize: 21,
  subtitleSize: 13,
  headerTextGap: 4,
  headerGap: 12,
  fieldHeight: 48,
  fieldGap: 10,
  formGap: 12,
  buttonHeight: 48,
  afterLoginGap: 8,
  afterForgotGap: 8,
  afterDividerGap: 10,
  afterCreateGap: 10,
  fieldFontSize: 15,
};
