import { useCallback, useRef, useState } from "react";

import { toast } from "@/components/feedback";
import { toastError } from "@/utils/errorToast/toastError";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { requestResync } from "@/lib/realtime/realtimeBus";

import { buildDisplayId } from "@/features/profile/utils/profileHelpers";

import { confirmCopy, webAccessCopy, type ConfirmAction } from "../confirmCopy";
import { sendPasswordReset, setUserStatus, setWebOverride } from "../services/userAdminApi";
import type { PortalAccess, RowActionKey, User } from "../userAdmin.types";

/** What an action needs; the row and the View drawer can both supply it. */
export type ActionTarget = Pick<User, "id" | "fullName"> & {
  verificationId: string | null;
  portalAccess?: PortalAccess | null;
};

type Options = {
  openReview: (verificationId: string, reject: boolean) => void;
  /** Always runs after a save attempt, so a refused action still shows the row's real state. */
  refresh: () => void;
};

const CONFIRMED: Partial<Record<ConfirmAction, { done: string; fail: string }>> = {
  deactivate: { done: "Account deactivated", fail: "Account not deactivated" },
  reactivate: { done: "Account reactivated", fail: "Account not reactivated" },
  approve: { done: "Request approved", fail: "Request not approved" },
  resetPassword: { done: "Reset code sent", fail: "Reset code not sent" },
};

/** Turns a row's menu choice into a dialog or a save. Toasts follow the server's answer, never the click. */
export const useRowActions = ({ openReview, refresh }: Options) => {
  const [confirming, setConfirming] = useState<{ action: ConfirmAction; target: ActionTarget } | null>(null);
  const [rejecting, setRejecting] = useState<ActionTarget | null>(null);
  const [editing, setEditing] = useState<ActionTarget | null>(null);
  const [busy, setBusy] = useState(false);
  const [webChange, setWebChange] = useState<{ target: ActionTarget; override: "allow" | "block" } | null>(null);
  const [savingOverrideId, setSavingOverrideId] = useState<string | null>(null);
  const savingOverride = useRef(false);

  const confirmWebChange = async (reason: string) => {
    if (!webChange || savingOverride.current) return;
    const { target, override } = webChange;
    savingOverride.current = true;
    setSavingOverrideId(target.id);
    try {
      const saved = await setWebOverride(target.id, override, target.portalAccess?.revision ?? 0, reason);
      toast.success(`Web access is ${saved.access.status === "on" ? "ON" : "OFF"}`, target.fullName);
    } catch (error) {
      if (normalizeApiError(error).status === 403) requestResync();
      toastError("Web access not changed", error);
    } finally {
      savingOverride.current = false;
      setSavingOverrideId(null);
      setWebChange(null);
      // Reloads even after a refusal, so the row always shows the server's real state.
      refresh();
    }
  };

  const run = useCallback(
    (target: ActionTarget, action: RowActionKey) => {
      if (action === "edit") return setEditing(target);
      if (action === "allowWeb") return setWebChange({ target, override: "allow" });
      if (action === "blockWeb") return setWebChange({ target, override: "block" });
      if ((action === "approve" || action === "reject") && target.verificationId) {
        return openReview(target.verificationId, action === "reject");
      }
      if (action === "reject") return setRejecting(target);
      setConfirming({ action, target });
    },
    [openReview]
  );

  const confirm = async () => {
    if (!confirming || busy) return;
    const { action, target } = confirming;
    const words = CONFIRMED[action];
    setBusy(true);
    try {
      const message = action === "resetPassword" ? await sendPasswordReset(target.id) : await setUserStatus(target.id, action as "deactivate" | "reactivate" | "approve");
      toast.success(words?.done ?? "Saved", message ?? target.fullName);
    } catch (error) {
      toastError(words?.fail ?? "Not saved", error);
    } finally {
      setBusy(false);
      setConfirming(null);
      refresh();
    }
  };

  const reject = async (reason: string, remarks?: string) => {
    if (!rejecting || busy) return;
    setBusy(true);
    try {
      await setUserStatus(rejecting.id, "reject", { reason, remarks });
      toast.success("Request rejected", rejecting.fullName);
    } catch (error) {
      toastError("Request not rejected", error);
    } finally {
      setBusy(false);
      setRejecting(null);
      refresh();
    }
  };

  return {
    run,
    busy,
    savingOverrideId,
    webChangeWords: webChange
      ? webAccessCopy(webChange.override, `${webChange.target.fullName} (${buildDisplayId(webChange.target.id, "RES")})`, Boolean(webChange.target.portalAccess?.globalEnabled))
      : null,
    confirmWebChange,
    cancelWebChange: () => {
      if (!savingOverride.current) setWebChange(null);
    },
    confirming,
    confirmWords: confirming ? confirmCopy(confirming.action, confirming.target.fullName) : null,
    confirm,
    cancelConfirm: () => setConfirming(null),
    rejecting,
    reject,
    cancelReject: () => setRejecting(null),
    editing,
    closeEdit: () => setEditing(null),
  };
};
