import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "@/hooks/useResponsive";
import { PAGE_PADDING } from "@/theme/breakpoints";

export type ModalFrame = {
  width: number;
  maxHeight: number;
  windowWidth: number;
  windowHeight: number;
};

const HEIGHT_RATIO = 0.9;

/**
 * Size for a centred dialog: never wider than `maxWidth`, always a phone gutter
 * away from the screen edges, and never taller than the safe area allows.
 */
export const useModalFrame = (maxWidth: number): ModalFrame => {
  const { width, height } = useResponsive();
  const insets = useSafeAreaInsets();
  const gutter = PAGE_PADDING.mobile;
  const usableHeight = height - insets.top - insets.bottom;

  return {
    width: Math.max(0, Math.min(maxWidth, width - gutter * 2)),
    maxHeight: Math.max(0, Math.round(usableHeight * HEIGHT_RATIO)),
    windowWidth: width,
    windowHeight: height,
  };
};
