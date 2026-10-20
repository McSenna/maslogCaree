// A local web dev server and API run on the same computer. Follow the page's
// host when a local API is configured, so changing Wi-Fi does not strand an
// already bundled LAN address. Hosted APIs and native clients keep their URL.
const isLocalHost = (host: string): boolean => {
  if (["localhost", "127.0.0.1", "[::1]"].includes(host)) return true;
  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || !parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)) return false;
  return parts[0] === 10 || (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
};

export const resolveApiBaseUrl = (
  configuredUrl: string | undefined,
  isDevelopment: boolean,
  webHostname?: string
): string => {
  let normalized = configuredUrl?.trim().replace(/\/+$/, "") || "http://localhost:5000/api";
  if (isDevelopment && webHostname && isLocalHost(webHostname)) {
    try {
      const url = new URL(normalized);
      if (["http:", "https:"].includes(url.protocol) && isLocalHost(url.hostname)) {
        url.hostname = webHostname;
        normalized = url.toString().replace(/\/+$/, "");
      }
    } catch {
      // Relative URLs already follow the page's origin.
    }
  }
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
