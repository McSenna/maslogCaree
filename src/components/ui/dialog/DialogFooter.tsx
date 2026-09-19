import type { ReactNode } from "react";
import { View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

import { DIALOG_CONTENT_PADDING } from "./dialogModalStyle";

type DialogFooterProps = {
  palette: ResidentDialogPalette;
  filled?: boolean;
  children: ReactNode;
};

const DialogFooter = ({ palette, filled = false, children }: DialogFooterProps) => (
  <View
    style={{
      paddingHorizontal: DIALOG_CONTENT_PADDING,
      paddingTop: 12,
      paddingBottom: filled ? 14 : 0,
      borderTopWidth: 1,
      borderTopColor: palette.divider,
      backgroundColor: filled ? palette.surface : undefined,
    }}
  >
    {children}
  </View>
);

export default DialogFooter;
