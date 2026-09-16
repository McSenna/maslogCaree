export const BOTTOM_NAV_ROW_HEIGHT = 44;

export const BOTTOM_NAV_TOP_PADDING = 6;

export const BOTTOM_NAV_MIN_BOTTOM_PADDING = 8;

export const BOTTOM_NAV_HEIGHT =
  BOTTOM_NAV_TOP_PADDING + BOTTOM_NAV_ROW_HEIGHT + BOTTOM_NAV_MIN_BOTTOM_PADDING;

export const BOTTOM_NAV_CONTENT_CLEARANCE = 10;

export const getBottomNavBottomPadding = (bottomInset: number): number => {
  return Math.max(bottomInset, BOTTOM_NAV_MIN_BOTTOM_PADDING);
};

export const getBottomNavHeight = (bottomInset: number): number => {
  return (
    BOTTOM_NAV_TOP_PADDING +
    BOTTOM_NAV_ROW_HEIGHT +
    getBottomNavBottomPadding(bottomInset)
  );
};

export const getBottomContentPadding = (bottomInset: number): number => {
  return getBottomNavHeight(bottomInset) + BOTTOM_NAV_CONTENT_CLEARANCE;
};
