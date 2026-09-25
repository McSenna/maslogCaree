import { useEffect, useState } from "react";
import ActionDialog, { type ActionDialogButton } from "./ActionDialog";
import {
  closeActionDialog,
  subscribeToActionDialog,
  type ActionDialogRequest,
  type DialogAction,
} from "./actionDialogStore";

const VARIANT: Record<NonNullable<DialogAction["style"]>, ActionDialogButton["variant"]> = {
  default: "primary",
  cancel: "secondary",
  destructive: "danger",
};

const ActionDialogHost = () => {
  const [request, setRequest] = useState<ActionDialogRequest | null>(null);

  useEffect(() => subscribeToActionDialog(setRequest), []);

  if (!request) return null;

  const run = (action?: DialogAction) => {
    closeActionDialog(request.id);
    action?.onPress?.();
  };

  const cancel = request.actions.find((action) => action.style === "cancel");
  const choices = request.actions.length ? request.actions : [{ text: "OK" }];
  const lastDefault = choices.map((action) => action.style ?? "default").lastIndexOf("default");
  const buttons = choices.map<ActionDialogButton>((action, index) => {
    const style = action.style ?? "default";
    const variant = style === "default" && index !== lastDefault ? "secondary" : VARIANT[style];
    return { label: action.text, variant, onPress: () => run(action) };
  });

  return (
    <ActionDialog
      visible
      title={request.title}
      message={request.message}
      destructive={request.actions.some((action) => action.style === "destructive")}
      actions={buttons}
      onClose={() => run(cancel)}
    />
  );
};

export default ActionDialogHost;
