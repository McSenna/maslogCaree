const seen = new Set<string>();

const describe = (detail: unknown): string => {
  if (detail === undefined || detail === null) return "";
  if (detail instanceof Error) return detail.message;
  return typeof detail === "string" ? detail : JSON.stringify(detail);
};

/** Dev-only, de-duplicated logging so a repeating failure cannot flood the console. */
export const logPushEvent = (message: string, detail?: unknown): void => {
  if (!__DEV__) return;

  const described = describe(detail);
  const key = `${message}|${described}`;
  if (seen.has(key)) return;
  seen.add(key);

  console.warn(`[push] ${message}${described ? `: ${described}` : ""}`);
};
