import { AxiosError, CanceledError, getAdapter, isAxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { retryDelay } from "./retryPolicy.ts";

type Diagnostic = {
  requestId: string; operation: string; method: string; durationMs: number;
  status?: number; category: string; retries: number;
};
const recent: Diagnostic[] = [];
export const getRequestDiagnostics = (): readonly Diagnostic[] => recent.map((entry) => ({ ...entry }));
const ROUTES = new Set(["login", "logout", "profile", "session", "appointments", "users", "inventory", "notifications", "register", "dashboard"]);
const operationOf = (config: InternalAxiosRequestConfig): string => {
  const first = String(config.url ?? "").split(/[/?#]/).filter(Boolean)[0];
  return ROUTES.has(first) ? first : "api";
};
const offline = () => typeof navigator !== "undefined" && navigator.onLine === false;
const pause = (ms: number, signal: AbortSignal): Promise<void> => new Promise((resolve, reject) => {
  const abort = () => { clearTimeout(timer); reject(new CanceledError()); };
  const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
  if (signal.aborted) abort();
  else signal.addEventListener("abort", abort, { once: true });
});

// Wrap the adapter once so response interceptors see only the final outcome.
// Attempts share a deadline and the same credentials and correlation ID.
export const installRequestTransport = (client: AxiosInstance): void => {
  const adapter = getAdapter(client.defaults.adapter);
  client.defaults.adapter = async (config) => {
    const started = Date.now();
    const budget = config.timeout && config.timeout > 0 ? config.timeout : 15000;
    const deadline = started + budget;
    const controller = new AbortController();
    const caller = config.signal;
    const cancel = () => controller.abort();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, budget);
    caller?.addEventListener?.("abort", cancel, { once: true });
    if (caller?.aborted) cancel();
    const requestId = `req-${started.toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    config.headers.set("X-Request-ID", requestId);
    let retries = 0;
    let status: number | undefined;
    let category = "success";
    try {
      for (;;) {
        if (controller.signal.aborted) throw new CanceledError();
        if (offline()) throw new AxiosError("Network Error", "ERR_NETWORK", config, {});
        try {
          config.headers.set("X-Request-Attempt", String(retries));
          const response = await adapter({ ...config, signal: controller.signal, timeout: Math.max(1, deadline - Date.now()) });
          status = response.status;
          return response;
        } catch (error) {
          if (!isAxiosError(error)) throw error;
          status = error.response?.status;
          const delay = retryDelay(error, config, retries);
          if (delay === null || offline() || controller.signal.aborted || Date.now() + delay >= deadline) throw error;
          await pause(delay, controller.signal);
          retries++;
        }
      }
    } catch (error) {
      const failure = timedOut ? new AxiosError("Request deadline exceeded", "ETIMEDOUT", config) : error;
      const code = isAxiosError(failure) ? failure.code : undefined;
      category = timedOut || code === "ECONNABORTED" || code === "ETIMEDOUT" ? "timeout"
        : code === "ERR_CANCELED" ? "cancelled" : status ? "http_error" : "network";
      throw failure;
    } finally {
      clearTimeout(timer);
      caller?.removeEventListener?.("abort", cancel);
      recent.push({ requestId, operation: operationOf(config), method: (config.method ?? "get").toUpperCase(),
        durationMs: Date.now() - started, status, category, retries });
      if (recent.length > 50) recent.shift();
    }
  };
};
