import { Alert, Platform } from "react-native";

/**
 * Cross-platform replacement for `Alert.alert`.
 *
 * react-native-web ships `Alert` as a no-op stub:
 *
 *     class Alert { static alert() {} }
 *
 * so every `Alert.alert(...)` call in this app was silently discarded on
 * Desktop/Tablet/Mobile Web — a failed login, a rejected booking and a server
 * outage all looked identical to the user: nothing happened. On web this
 * routes to the browser dialogs instead; on Android/iOS it stays the native
 * Alert, unchanged.
 *
 * Prefer inline error state for form validation. Use this for one-off
 * notifications and confirmations.
 */

export type NotifyButtonStyle = "default" | "cancel" | "destructive";

export interface NotifyButton {
  text: string;
  style?: NotifyButtonStyle;
  onPress?: () => void;
}

const joinText = (title: string, message?: string): string =>
  message ? `${title}\n\n${message}` : title;

const isWeb = Platform.OS === "web";

const hasDomDialogs = (): boolean =>
  typeof window !== "undefined" && typeof window.alert === "function";

/** Runs a button handler without letting its failure escape as an unhandled rejection. */
function runHandler(button?: NotifyButton) {
  try {
    button?.onPress?.();
  } catch (error) {
    console.error("[notify] alert action failed", error);
  }
}

export function showAlert(
  title: string,
  message?: string,
  buttons?: NotifyButton[]
): void {
  if (!isWeb) {
    Alert.alert(title, message, buttons);
    return;
  }

  // Server-side rendering, or a browser with dialogs disabled: at minimum keep
  // the message out of the void so it is still diagnosable.
  if (!hasDomDialogs()) {
    console.warn(`[notify] ${joinText(title, message)}`);
    return;
  }

  const list = buttons ?? [];
  const confirmable = list.filter((b) => b.style !== "cancel");
  const cancelButton = list.find((b) => b.style === "cancel");

  // A single action (or none) is informational — acknowledge and continue.
  if (confirmable.length <= 1 && list.length <= 1) {
    window.alert(joinText(title, message));
    runHandler(list[0]);
    return;
  }

  // Two or more actions is a confirmation. window.confirm offers exactly the
  // OK/Cancel pair, which matches every confirm dialog in this app.
  const accepted = window.confirm(joinText(title, message));
  runHandler(accepted ? confirmable[0] : cancelButton);
}

/** Convenience wrapper so error call sites read consistently. */
export const showErrorAlert = (title: string, message: string): void =>
  showAlert(title, message);
