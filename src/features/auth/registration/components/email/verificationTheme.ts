import { Platform } from "react-native";
import type { OtpPalette } from "@/components/ui/OtpCodeInput";
import { REG_COLORS } from "../../registrationTheme";

export const OTP_PALETTE: OtpPalette = {
  border: REG_COLORS.controlBorder,
  borderHover: REG_COLORS.muted,
  primary: REG_COLORS.primary,
  primaryRing: REG_COLORS.primaryRing,
  surface: REG_COLORS.surface,
  surfaceFilled: REG_COLORS.primarySoft,
  text: REG_COLORS.text,
  error: REG_COLORS.error,
  errorRing: REG_COLORS.errorRing,
  success: REG_COLORS.success,
  disabled: REG_COLORS.disabled,
};

export const STATUS_STYLE = {
  error: { icon: "alert-circle", color: REG_COLORS.error },
  success: { icon: "check-circle", color: REG_COLORS.successText },
  info: { icon: "info", color: REG_COLORS.muted },
} as const;

export const webOnly = (props: Record<string, unknown>) => (Platform.OS === "web" ? (props as object) : {});
