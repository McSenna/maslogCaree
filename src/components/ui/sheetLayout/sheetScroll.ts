import { Platform } from "react-native";

/**
 * keyboardDismissMode for scroll areas inside sheets. Native dismisses the
 * keyboard when the user drags the form. On web, react-native-web implements
 * "on-drag" by blurring the focused input on every scroll event, including the
 * browser's own scroll-into-view when focus moves to a lower field, so focus
 * was lost mid-typing; the browser handles its keyboard itself there.
 */
export const SHEET_KEYBOARD_DISMISS_MODE = Platform.OS === "web" ? "none" : "on-drag";
