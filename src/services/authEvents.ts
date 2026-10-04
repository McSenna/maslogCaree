import { toast } from "@/components/feedback/toast/toastStore";
import { sessionEndNotice } from "@/utils/errorToast/errorToastPolicy";
import { clearStoredUser, getStoredUser } from "@/utils/storage";

type LogoutListener = () => void;

const logoutListeners = new Set<LogoutListener>();

// Requests already in flight when the session ends fail with the same refusal;
// for this long their own error toasts stay quiet behind the sign-out notice.
const SESSION_END_QUIET_MS = 5000;

let sessionEndedAt = Number.NEGATIVE_INFINITY;
let signingOut = false;

export const subscribeToLogout = (listener: LogoutListener): () => void => {
  logoutListeners.add(listener);
  return () => logoutListeners.delete(listener);
};

export const emitLogout = (): void => {
  for (const listener of logoutListeners) {
    try {
      listener();
    } catch {
    }
  }
};

export const sessionEndedRecently = (): boolean => Date.now() - sessionEndedAt < SESSION_END_QUIET_MS;

/** The user chose to sign out, so the server refusing the old token on the way out is not news. */
export const beginSignOut = (): void => {
  signingOut = true;
};

/**
 * Ends the local session. With a `reason` (a refusal code from the server or
 * the realtime handshake) the user did not ask for this, so the first refusal
 * tells them why; the burst of refusals that follows finds no session left.
 */
export const forceLogout = async (reason?: string): Promise<void> => {
  const announce = Boolean(reason) && getStoredUser() !== null && !signingOut;
  if (!reason) signingOut = false;
  clearStoredUser();
  emitLogout();
  if (!announce || !reason) return;

  sessionEndedAt = Date.now();
  const notice = sessionEndNotice(reason);
  toast.error(notice.title, notice.description);
};
