import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

export type FieldVisualState = {
  focused?: boolean;
  invalid?: boolean;
  disabled?: boolean;
};

export const fieldSurface = ({ focused, invalid, disabled }: FieldVisualState) => ({
  borderWidth: 1,
  borderRadius: REG_RADIUS.control,
  borderColor: invalid
    ? REG_COLORS.error
    : focused
      ? REG_COLORS.primary
      : REG_COLORS.border,
  backgroundColor: disabled
    ? REG_COLORS.disabled
    : focused
      ? REG_COLORS.surface
      : REG_COLORS.surface,
  boxShadow: focused
    ? `0px 0px 0px 3px ${invalid ? REG_COLORS.errorRing : REG_COLORS.primaryRing}`
    : "0px 0px 0px 0px rgba(0,0,0,0)",
});

export const fieldTextColor = (disabled?: boolean) =>
  disabled ? REG_COLORS.muted : REG_COLORS.text;
