import { Platform } from "react-native";

/**
 * On web the Modal root is the page's one `role="dialog"` element, so the
 * title and subtitle name and describe it there. Native reads the label.
 */
export const dialogLabelProps = (titleId: string, subtitleId: string, title: string): object =>
  Platform.OS === "web"
    ? { "aria-labelledby": titleId, "aria-describedby": subtitleId }
    : { accessibilityLabel: title };
