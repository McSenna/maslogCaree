import { Platform } from "react-native";

import { webStyle } from "@/theme/webStyle";

/** The details hold nothing to tab to, so on web the scroller itself takes focus for the arrow keys. */
export const detailsScrollRegionProps =
  Platform.OS === "web"
    ? ({ tabIndex: 0, role: "region", accessibilityLabel: "Resident details content" } as object)
    : {};

// Keeps the focus outline inside the scroller, which runs to the dialog's edges.
export const detailsScrollRegionStyle = webStyle({ outlineOffset: -2 });
