import { useCallback, useMemo, useState } from "react";

import { normalizeApiError } from "@/utils/apiErrorHandler";
import { reportError } from "@/utils/errorReporting";

import type { ChangePasswordPayload } from "./changePassword.types";
import {
  createSubmitGate,
  outcomeForFailure,
  outcomeForResponse,
  type ChangePasswordOutcome,
} from "./changePasswordOutcome";
import { changePasswordApi, storeRotatedToken } from "./changePasswordService";

/**
 * The change request itself. Resolves to what the user may be told, or to
 * undefined when a press arrived while a request was already in flight.
 * Passwords live only in the payload of this one call: never in logs, reports or storage.
 */
export const useChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitGate = useMemo(() => createSubmitGate(), []);

  const changePassword = useCallback(
    (payload: ChangePasswordPayload): Promise<ChangePasswordOutcome | undefined> =>
      submitGate(async () => {
        setIsSubmitting(true);
        try {
          const outcome = outcomeForResponse(await changePasswordApi(payload));
          // Before anything else runs: the old token stopped working the moment the change saved.
          if (outcome.kind === "changed" && outcome.token) storeRotatedToken(outcome.token);
          return outcome;
        } catch (error) {
          const outcome = outcomeForFailure(normalizeApiError(error));
          // reportError sends only the error's kind, code and status.
          if (outcome.kind === "unconfirmed" || outcome.kind === "failed") reportError("Password change not confirmed", error);
          return outcome;
        } finally {
          setIsSubmitting(false);
        }
      }),
    [submitGate]
  );

  return { changePassword, isSubmitting };
};
