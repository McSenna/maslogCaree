import { useCallback, useState } from "react";

import { openActionDialog } from "@/components/feedback/dialog/actionDialogStore";
import { useLatestRef } from "@/hooks/useLatestRef";

import type { ChangePasswordBanner } from "./changePassword.types";
import type { ChangePasswordOutcome } from "./changePasswordOutcome";
import { CHANGE_PASSWORD_STRINGS as S } from "./changePasswordStrings";
import { useChangePassword } from "./useChangePassword";
import { useChangePasswordForm } from "./useChangePasswordForm";

type Options = {
  onClose: () => void;
  onSuccess?: () => void;
};

const bannerFor = (outcome: ChangePasswordOutcome): ChangePasswordBanner | null => {
  switch (outcome.kind) {
    case "unconfirmed":
      return { tone: "warning", message: outcome.message, retry: true, persistent: true };
    case "failed":
      return { tone: "danger", message: outcome.message, retry: true, persistent: false };
    case "rateLimited":
      return { tone: "danger", message: outcome.message, retry: false, persistent: false };
    case "rejected":
      return outcome.field ? null : { tone: "danger", message: outcome.message, retry: false, persistent: false };
    default:
      return null;
  }
};

/**
 * Everything the change password surfaces share: the form, the request, the
 * banner, and how the dialog may close. The modal and the full-screen screen
 * only lay it out.
 */
export const useChangePasswordFlow = ({ onClose, onSuccess }: Options) => {
  const form = useChangePasswordForm();
  const { changePassword, isSubmitting } = useChangePassword();
  const [banner, setBanner] = useState<ChangePasswordBanner | null>(null);
  const onCloseRef = useLatestRef(onClose);
  const onSuccessRef = useLatestRef(onSuccess);

  const close = useCallback(() => {
    form.reset();
    setBanner(null);
    onCloseRef.current();
  }, [form, onCloseRef]);

  /** ×, Cancel, Escape, the backdrop and Android back all come here. */
  const requestClose = useCallback(() => {
    if (isSubmitting) return;
    if (!form.isDirty) {
      close();
      return;
    }
    openActionDialog(S.discard.title, S.discard.message, [
      { text: S.discard.keep, style: "cancel" },
      { text: S.discard.confirm, style: "destructive", onPress: close },
    ]);
  }, [isSubmitting, form.isDirty, close]);

  const submit = useCallback(async () => {
    if (!form.validateAll()) return;
    // An unanswered attempt stays on screen: a retry does not tell whether it went through.
    setBanner((current) => (current?.persistent ? current : null));

    const outcome = await changePassword({
      currentPassword: form.values.currentPassword,
      newPassword: form.values.newPassword,
    });
    if (!outcome) return;

    if (outcome.kind === "changed") {
      close();
      onSuccessRef.current?.();
      return;
    }
    // The API client already signed out and is showing why.
    if (outcome.kind === "sessionEnded") {
      close();
      return;
    }
    if (outcome.kind === "rejected" && outcome.field) form.showServerError(outcome.field, outcome.message);
    const next = bannerFor(outcome);
    setBanner((current) => next ?? (current?.persistent ? current : null));
  }, [form, changePassword, close, onSuccessRef]);

  return { form, banner, isSubmitting, submit, requestClose };
};

export type ChangePasswordFlow = ReturnType<typeof useChangePasswordFlow>;
