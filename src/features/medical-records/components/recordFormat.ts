const safeDate = (iso?: string | null): Date | null => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDateTime = (iso?: string | null): string => {
  const d = safeDate(iso);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDate = (iso?: string | null): string => {
  const d = safeDate(iso);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const shortReference = (prefix: string, id: string): string =>
  `${prefix}-${String(id).slice(-8).toUpperCase()}`;
