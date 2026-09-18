import { useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

export type DialogPresentation = "modal" | "sheet";

/**
 * One rule for every resident overlay: a centred modal once there is desktop
 * room for it, a bottom sheet at phone width — including a narrow browser
 * window, which is how residents reach the web app on their phones.
 */
export const useDialogPresentation = (): DialogPresentation => {
  const { width } = useWindowDimensions();
  return width >= BREAKPOINTS.tablet ? "modal" : "sheet";
};
