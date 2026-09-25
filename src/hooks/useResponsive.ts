import { useMemo } from "react";
import { Platform, useWindowDimensions } from "react-native";
import {
  getBreakpoint,
  PAGE_PADDING,
  pickForBreakpoint,
  type Breakpoint,
  type BreakpointValues,
} from "@/theme/breakpoints";

export type Responsive = {
  width: number;
  height: number;
  fontScale: number;
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWideDesktop: boolean;
  isWeb: boolean;
  isLandscape: boolean;
  isDesktopWeb: boolean;
  pagePadding: number;
  select: <T>(values: BreakpointValues<T>) => T;
};

const IS_WEB = Platform.OS === "web";

export const useResponsive = (): Responsive => {
  const { width, height, fontScale } = useWindowDimensions();

  return useMemo(() => {
    const breakpoint = getBreakpoint(width);
    const isMobile = breakpoint === "mobile";

    return {
      width,
      height,
      fontScale,
      breakpoint,
      isMobile,
      isTablet: breakpoint === "tablet",
      isDesktop: breakpoint === "desktop" || breakpoint === "wide",
      isWideDesktop: breakpoint === "wide",
      isWeb: IS_WEB,
      isLandscape: width > height,
      isDesktopWeb: IS_WEB && !isMobile,
      pagePadding: PAGE_PADDING[breakpoint],
      select: <T,>(values: BreakpointValues<T>) => pickForBreakpoint(breakpoint, values),
    };
  }, [width, height, fontScale]);
};
