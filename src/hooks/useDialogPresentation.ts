import { useResponsive } from "@/hooks/useResponsive";

export type DialogPresentation = "modal" | "sheet";

export const useDialogPresentation = (): DialogPresentation =>
  useResponsive().isMobile ? "sheet" : "modal";
