export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  tablet: 768,
  desktop: 1024,
  xl: 1280,
} as const;

export const isTabletWidth = (width: number): boolean => {
  return width >= BREAKPOINTS.tablet;
};

export const isDesktopWidth = (width: number): boolean => {
  return width >= BREAKPOINTS.desktop;
};
