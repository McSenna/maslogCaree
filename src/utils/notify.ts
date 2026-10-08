import { Alert, Platform } from "react-native";

import { openActionDialog, type DialogAction } from "@/components/feedback/dialog/actionDialogStore";
import { toast } from "@/components/feedback/toast/toastStore";

export type NotifyButtonStyle = DialogAction["style"];

export type NotifyButton = DialogAction;

export const showAlert = (title: string, message?: string, buttons?: NotifyButton[]): void => {
  if (!buttons?.length) {
    toast.info(title, message);
    return;
  }

  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  openActionDialog(title, message, buttons);
};

export const showErrorAlert = (title: string, message: string): void => {
  toast.error(title, message);
};
