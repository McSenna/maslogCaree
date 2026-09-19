import { ScrollView } from "react-native";

import BottomSheet, { SHEET_SCROLL_STYLE } from "@/components/ui/BottomSheet";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import DialogFooter from "../DialogFooter";
import { DialogHeader } from "../DialogHeader";
import { DIALOG_CONTENT_PADDING } from "../dialogModalStyle";
import type { DialogShellProps } from "./dialogShell.types";

/** Bottom sheet for phone-width viewports, web included. */
export const DialogSheetShell = ({
  visible,
  title,
  icon,
  tint,
  tintSoft,
  onClose,
  children,
  footer,
  onDismissRequest,
}: DialogShellProps) => {
  const palette = useResidentDialogPalette();

  if (!visible) return null;

  return (
    <BottomSheet
      visible
      onClose={onClose}
      onDismissRequest={onDismissRequest}
      footer={footer ? <DialogFooter palette={palette}>{footer}</DialogFooter> : undefined}
      accessibilityLabel={title}
      surface={palette.surface}
      handleColor={palette.isDark ? "#475569" : "#CBD5E1"}
      maxHeightRatio={0.92}
      header={(requestClose) => (
        <DialogHeader
          palette={palette}
          title={title}
          icon={icon}
          tint={tint}
          tintSoft={tintSoft}
          onClose={requestClose}
        />
      )}
    >
      {/* SHEET_SCROLL_STYLE carries the sizing; adding `flex: 1` collapses it. */}
      <ScrollView
        style={SHEET_SCROLL_STYLE}
        contentContainerStyle={{ padding: DIALOG_CONTENT_PADDING, paddingBottom: DIALOG_CONTENT_PADDING }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </BottomSheet>
  );
};
