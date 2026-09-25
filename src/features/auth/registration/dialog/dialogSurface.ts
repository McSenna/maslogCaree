import { clampMinHeight } from "@/components/ui/sheetLayout/sheetGeometry";
import type { SheetLayout } from "@/components/ui/sheetLayout/useSheetLayout";

import { REG_COLORS, REG_RADIUS } from "../registrationTheme";

const PREFERRED_SHEET_HEIGHT = 560;
const PREFERRED_SHEET_SHARE = 0.7;

/**
 * Both bounds come from the shared sheet layout, so they already exclude the
 * status bar and whatever the keyboard covers. The preferred minimum (which
 * stops the sheet jumping in height between steps) is clamped to the maximum:
 * it used to be a fixed share of the window and pushed the sheet under the
 * status bar once the keyboard took half the screen.
 */
export const dialogSurfaceStyle = (isSheet: boolean, layout: SheetLayout) => ({
  width: "100%" as const,
  maxWidth: isSheet ? undefined : 760,
  maxHeight: layout.maxHeight,
  minHeight: isSheet
    ? clampMinHeight(
        Math.min(
          (layout.containerHeight - layout.keyboardOverlap) * PREFERRED_SHEET_SHARE,
          PREFERRED_SHEET_HEIGHT
        ),
        layout.maxHeight
      )
    : undefined,
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

/** Colour and side margins only: SheetViewport owns the vertical limits. */
export const dialogBackdropStyle = (isSheet: boolean) => ({
  backgroundColor: isSheet ? "rgba(8, 21, 47, 0.38)" : REG_COLORS.overlay,
  paddingHorizontal: isSheet ? 0 : DESKTOP_EDGE,
});

export const DESKTOP_EDGE = 24;
