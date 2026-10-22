// In development the API runs on the same computer as the dev server. When a
// local API is configured, follow the dev server's host (the browser page on
// web, Metro on a phone), so changing Wi-Fi does not strand a bundled LAN
// address. Production requires a public HTTPS API or a same-origin proxy.
const DEVELOPMENT_DEFAULT = "http://localhost:3000/api";

const ipv4Parts = (host: string): number[] | null => {
  const parts = host.split(".").map(Number);
  return parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255) ? parts : null;
};

const isLoopback = (host: string): boolean =>
  host === "localhost" || host === "[::1]" || ipv4Parts(host)?.[0] === 127;

const isLocalHost = (host: string): boolean => {
  if (isLoopback(host) || host === "[::]") return true;
  const parts = ipv4Parts(host);
  if (!parts) return false;
  return parts[0] === 0 || parts[0] === 10 ||
    (parts[0] === 169 && parts[1] === 254) || (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
};

/**
 * The computer's address as a phone sees it, from Expo's "host:port" hostUri.
 * A loopback host means Metro is reached over a USB port forward, which does
 * not carry the API's port, so the configured URL is kept instead.
 */
export const metroHostname = (hostUri: string | undefined): string | undefined => {
  if (!hostUri) return undefined;
  try {
    const { hostname } = new URL(`http://${hostUri}`);
    return isLoopback(hostname) ? undefined : hostname;
  } catch {
    return undefined;
  }
};

const validateProductionUrl = (value: string): void => {
  if (!value) {
    throw new Error("EXPO_PUBLIC_API_URL is not set. Production builds need a public HTTPS backend URL or a same-origin /api proxy.");
  }
  // A same-origin proxy inherits HTTPS from the deployed page.
  if (value.startsWith("/") && !value.startsWith("//")) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !isLocalHost(url.hostname)) return;
  } catch {
    // Unparseable values get the same actionable error as local ones.
  }
  throw new Error(`EXPO_PUBLIC_API_URL "${value}" cannot be used in production. Use a public HTTPS backend URL or a same-origin /api proxy.`);
};

export const resolveApiBaseUrl = (
  configuredUrl: string | undefined,
  isDevelopment: boolean,
  devServerHost?: string
): string => {
  const configured = configuredUrl?.trim().replace(/\/+$/, "") ?? "";
  if (!isDevelopment) validateProductionUrl(configured);
  let normalized = configured || DEVELOPMENT_DEFAULT;
  if (isDevelopment && devServerHost && isLocalHost(devServerHost)) {
    try {
      const url = new URL(normalized);
      if (["http:", "https:"].includes(url.protocol) && isLocalHost(url.hostname)) {
        url.hostname = devServerHost;
        normalized = url.toString().replace(/\/+$/, "");
      }
    } catch {
      // Relative URLs already follow the page's origin.
    }
  }
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
