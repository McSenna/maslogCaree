import { Platform } from "react-native";

import { toast } from "@/components/feedback/toast/toastStore";
import { ApiError } from "@/utils/apiErrorHandler";
import { reportError } from "@/utils/errorReporting";
import { createNoticeThrottle } from "@/utils/errorToast/errorToastPolicy";
import { toastError } from "@/utils/errorToast/toastError";

const TITLE = "That did not finish";
const NEXT_STEP =
  Platform.OS === "web"
    ? "Try again. If it keeps happening, reload the page."
    : "Try again. If it keeps happening, close and reopen the app.";

const isDev = typeof __DEV__ !== "undefined" && __DEV__;
const allowNotice = createNoticeThrottle(30_000);
let notifying = false;

/**
 * Last line for failures no screen caught. A server error keeps its plain
 * reason; anything else is a code fault whose text means nothing to a
 * resident, so only the next step is shown. The guard stops a failure inside
 * the toast path from feeding back into these handlers.
 */
const notifyUnexpected = (context: string, error: unknown): void => {
  if (notifying) return;
  notifying = true;
  try {
    if (!allowNotice(context)) reportError(context, error);
    else if (error instanceof ApiError) toastError(TITLE, error, { fallback: NEXT_STEP });
    else {
      reportError(context, error);
      toast.error(TITLE, NEXT_STEP);
    }
  } catch {
    // Nothing more can be shown safely from here.
  } finally {
    notifying = false;
  }
};

type GlobalHandler = (error: unknown, isFatal?: boolean) => void;
type ErrorUtilsShape = { getGlobalHandler: () => GlobalHandler; setGlobalHandler: (handler: GlobalHandler) => void };
type RejectionTracker = (options: {
  allRejections: boolean;
  onUnhandled: (id: number, error: unknown) => void;
  onHandled: (id: number) => void;
}) => void;
type NativeGlobals = { ErrorUtils?: ErrorUtilsShape; HermesInternal?: { enablePromiseRejectionTracker?: RejectionTracker } };

const installNative = (): (() => void) => {
  const globals = globalThis as NativeGlobals;
  const errorUtils = globals.ErrorUtils;
  const previous = errorUtils?.getGlobalHandler();
  if (errorUtils && previous) {
    // A fatal error ends the app either way, so only recoverable ones get a toast.
    errorUtils.setGlobalHandler((error, isFatal) => {
      if (!isFatal) notifyUnexpected("Uncaught error", error);
      previous(error, isFatal);
    });
  }
  // React Native tracks rejections only in development (for its LogBox); release builds drop them silently.
  if (!isDev) {
    globals.HermesInternal?.enablePromiseRejectionTracker?.({
      allRejections: true,
      onUnhandled: (_id, error) => notifyUnexpected("Unhandled promise rejection", error),
      onHandled: () => undefined,
    });
  }
  return () => {
    if (errorUtils && previous) errorUtils.setGlobalHandler(previous);
  };
};

const installWeb = (): (() => void) => {
  const onRejection = (event: PromiseRejectionEvent) => notifyUnexpected("Unhandled promise rejection", event.reason);
  // Without an error object the event is a browser notice (ResizeObserver, a cross-origin script), not an app failure.
  const onError = (event: ErrorEvent) => {
    if (event.error != null) notifyUnexpected("Uncaught error", event.error);
  };
  window.addEventListener("unhandledrejection", onRejection);
  window.addEventListener("error", onError);
  return () => {
    window.removeEventListener("unhandledrejection", onRejection);
    window.removeEventListener("error", onError);
  };
};

/** Installed once from the app shell; returns the uninstall for its effect cleanup. */
export const installGlobalErrorHandlers = (): (() => void) => {
  if (Platform.OS !== "web") return installNative();
  return typeof window === "undefined" ? () => undefined : installWeb();
};
