import { useMemo } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { OtpPalette } from "./otpTypes";

export const useThemedOtpPalette = (): OtpPalette => {
  const colors = useThemeColors();

  return useMemo(
    () => ({
      border: colors.borderStrong,
      borderHover: colors.muted,
      primary: colors.primary,
      primaryRing: colors.focusRing,
      surface: colors.surface,
      surfaceFilled: colors.primarySoft,
      text: colors.heading,
      error: colors.danger.fg,
      errorRing: colors.danger.border,
      success: colors.success.fg,
      disabled: colors.subtle,
    }),
    [colors]
  );
};
