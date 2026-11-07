import { ScrollView } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { residentDialogPalette, useResidentDialogPalette } from "@/design/residentDialogTheme";

import DialogFooter from "../DialogFooter";
import { DialogHeader } from "../DialogHeader";
import { ProminentDialogHeader } from "../ProminentDialogHeader";
import { DIALOG_CONTENT_PADDING } from "../dialogModalStyle";
import type { DialogShellProps } from "./dialogShell.types";
import { useShellScrollRequest } from "./useShellScrollRequest";
import { PALETTE } from "@/theme/palette";

const LIGHT_PALETTE = residentDialogPalette(false);

/** Bottom sheet for phone-width viewports, web included. */
export const DialogSheetShell = ({
  visible,
  title,
  subtitle,
  icon,
  media,
  tint,
  tintSoft,
  onClose,
  children,
  footer,
  flush = false,
  sheetHeightRatio = 0.92,
  lightSurface = false,
  onDismissRequest,
  headerVariant = "default",
  subheader,
  scrollToKey,
  scrollToY,
  aside,
}: DialogShellProps) => {
  const themedPalette = useResidentDialogPalette();
  const palette = lightSurface ? LIGHT_PALETTE : themedPalette;
  const scrollRef = useShellScrollRequest(scrollToKey, scrollToY);
  const Header = headerVariant === "prominent" ? ProminentDialogHeader : DialogHeader;

  if (!visible) return null;

  return (
    <BottomSheet
      visible
      onClose={onClose}
      onDismissRequest={onDismissRequest}
      footer={footer ? <DialogFooter palette={palette}>{footer}</DialogFooter> : undefined}
      accessibilityLabel={title}
      surface={palette.surface}
      handleColor={palette.isDark ? PALETTE.slate[700] : PALETTE.slate[300]}
      maxHeightRatio={sheetHeightRatio}
      header={(requestClose) => (
        <>
        <Header
          palette={palette}
          title={title}
          subtitle={subtitle}
          icon={icon}
          media={media}
          tint={tint}
          tintSoft={tintSoft}
          onClose={requestClose}
        />
        {subheader}
        </>
      )}
    >
      {/* SHEET_SCROLL_STYLE carries the sizing; adding `flex: 1` collapses it. */}
      <ScrollView
        ref={scrollRef}
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={flush ? undefined : { padding: DIALOG_CONTENT_PADDING, paddingBottom: DIALOG_CONTENT_PADDING }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
        {aside}
      </ScrollView>
    </BottomSheet>
  );
};
