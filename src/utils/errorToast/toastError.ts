import { toast, type ToastAction } from "@/components/feedback/toast/toastStore";
import { getConnectionStatus } from "@/lib/realtime/realtimeBus";
import { sessionEndedRecently } from "@/services/authEvents";
import { normalizeApiError } from "@/utils/apiErrorHandler";
import { reportError } from "@/utils/errorReporting";

import { createNoticeThrottle, errorToastReason, isAlreadyExplained, type ReasonOptions } from "./errorToastPolicy";

type ToastErrorOptions = ReasonOptions & { action?: ToastAction };

/**
 * The shared path from a caught failure to the error toast. `title` names what
 * did not happen ("Appointment not booked"); the description is the server's
 * plain-words reason, or `fallback`. Pass `inline: true` when the form already
 * shows the reason, so the toast only marks the failed attempt.
 */
export const toastError = (title: string, error: unknown, options: ToastErrorOptions = {}): void => {
  reportError(title, error);
  const normalized = normalizeApiError(error);
  if (isAlreadyExplained(normalized, sessionEndedRecently())) return;
  toast.error(title, errorToastReason(normalized, options), options.action);
};

export const REFRESH_FAILED = "Showing the last loaded information. Try again in a moment.";

const BACKGROUND_WINDOW_MS = 60_000;
const allowBackgroundNotice = createNoticeThrottle(BACKGROUND_WINDOW_MS);

/**
 * For reloads nobody asked for (a realtime change, a reconnect). The screen
 * keeps what it already shows, so the toast only says the view may be behind,
 * at most once a minute per title. While the connection is down the
 * connection notice already said so, and these stay quiet.
 */
export const toastBackgroundError = (title: string, error: unknown): void => {
  reportError(title, error);
  const normalized = normalizeApiError(error);
  if (isAlreadyExplained(normalized, sessionEndedRecently())) return;
  const connectionDown = getConnectionStatus() === "offline" || getConnectionStatus() === "reconnecting";
  if ((normalized.isNetworkError || normalized.isTimeoutError) && connectionDown) return;
  if (!allowBackgroundNotice(title)) return;
  toast.error(title, REFRESH_FAILED);
};
