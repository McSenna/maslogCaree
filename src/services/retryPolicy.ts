import type { AxiosError, InternalAxiosRequestConfig } from "axios";

const TRANSIENT_STATUS = new Set([429, 502, 503, 504]);
const TRANSIENT_NETWORK = new Set(["ERR_NETWORK", "ECONNRESET", "EAI_AGAIN"]);

export const retryDelay = (error: AxiosError, config: InternalAxiosRequestConfig, attempt: number): number | null => {
  if (attempt >= 2 || !["get", "head"].includes(config.method?.toLowerCase() ?? "get")) return null;
  if (error.response ? !TRANSIENT_STATUS.has(error.response.status) : !TRANSIENT_NETWORK.has(error.code ?? "")) return null;
  const guidance = error.response?.headers["retry-after"];
  const text = typeof guidance === "string" || typeof guidance === "number" ? String(guidance).trim() : "";
  const seconds = /^\d+(\.\d+)?$/.test(text) ? Number(text) : null;
  const date = seconds === null ? Date.parse(text) : Number.NaN;
  const serverDelay = seconds !== null ? seconds * 1000 : Number.isFinite(date) ? Math.max(0, date - Date.now()) : 0;
  return Math.max(serverDelay, Math.round(200 * 2 ** attempt * (0.5 + Math.random())));
};
