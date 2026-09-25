import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { SheetLayoutProvider } from "./SheetLayoutContext";
import type { SheetLayout } from "./useSheetLayout";

type SheetViewportProps = {
  layout: SheetLayout;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * The full-screen view a modal's sheet or card sits in. It reserves the safe
 * area above (so nothing can slide under the status bar or notch) and the
 * keyboard overlap below, measures itself for `useSheetLayout`, and shares the
 * layout with everything inside through context.
 *
 * Put the scrim and the sheet surface inside; give the surface
 * `maxHeight: layout.maxHeight` so long content scrolls instead of growing.
 */
const SheetViewport = ({ layout, style, children }: SheetViewportProps) => (
  <SheetLayoutProvider value={layout}>
    <View
      onLayout={layout.onContainerLayout}
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: layout.variant === "sheet" ? "flex-end" : "center",
        },
        style,
        // Last, so no caller style can let the surface under the status bar or keyboard.
        {
          paddingTop: layout.containerPadding.top,
          paddingBottom: layout.containerPadding.bottom,
        },
      ]}
    >
      {children}
    </View>
  </SheetLayoutProvider>
);

export default SheetViewport;
