import { Alert, Platform } from "react-native";

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

const runHandler = (button?: NotifyButton) => {
  try {
    button?.onPress?.();
  } catch (error) {
    console.error("[notify] alert action failed", error);
  }
};

export const showAlert = (
  title: string,
  message?: string,
  buttons?: NotifyButton[]
): void => {
  if (!isWeb) {
    Alert.alert(title, message, buttons);
    return;
  }

  if (!hasDomDialogs()) {
    console.warn(`[notify] ${joinText(title, message)}`);
    return;
  }

  const list = buttons ?? [];
  const confirmable = list.filter((b) => b.style !== "cancel");
  const cancelButton = list.find((b) => b.style === "cancel");

  if (confirmable.length <= 1 && list.length <= 1) {
    window.alert(joinText(title, message));
    runHandler(list[0]);
    return;
  }

  const accepted = window.confirm(joinText(title, message));
  runHandler(accepted ? confirmable[0] : cancelButton);
};

export const showErrorAlert = (title: string, message: string): void =>
  showAlert(title, message);
