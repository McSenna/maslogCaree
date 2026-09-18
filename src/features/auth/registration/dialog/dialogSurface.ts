import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

/**
 * `height` is the room the sheet actually has: the window minus whatever the
 * keyboard is covering. Both bounds have to shrink with it, or the minimum
 * height alone pushes the form taller than the space left above the keys.
 */
export const dialogSurfaceStyle = (isSheet: boolean, height: number) => ({
  width: "100%" as const,
  maxWidth: isSheet ? undefined : 760,
  maxHeight: isSheet ? height * 0.94 : ("92%" as const),
  minHeight: isSheet ? Math.min(height * 0.7, 560) : undefined,
  backgroundColor: REG_COLORS.surface,
  borderTopLeftRadius: isSheet ? REG_RADIUS.sheet : REG_RADIUS.modal,
  borderTopRightRadius: isSheet ? REG_RADIUS.sheet : REG_RADIUS.modal,
  borderBottomLeftRadius: isSheet ? 0 : REG_RADIUS.modal,
  borderBottomRightRadius: isSheet ? 0 : REG_RADIUS.modal,
  borderWidth: isSheet ? 0 : 1,
  borderColor: REG_COLORS.border,
  overflow: "hidden" as const,
  boxShadow: "0px 18px 48px rgba(8, 21, 47, 0.18)",
});

export const dialogBackdropStyle = (isSheet: boolean) => ({
  flex: 1,
  justifyContent: isSheet ? ("flex-end" as const) : ("center" as const),
  alignItems: "center" as const,
  backgroundColor: isSheet ? "rgba(8, 21, 47, 0.38)" : REG_COLORS.overlay,
  padding: isSheet ? 0 : 24,
});
