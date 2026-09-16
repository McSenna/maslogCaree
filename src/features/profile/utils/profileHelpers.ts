export const NOT_PROVIDED = "Not provided";

const OBJECT_ID = /^[0-9a-f]{24}$/i;

export const getCreationDateFromId = (id: string | number): Date | null => {
  const raw = String(id);
  if (!OBJECT_ID.test(raw)) return null;

  const seconds = parseInt(raw.slice(0, 8), 16);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;

  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildDisplayId = (
  id: string | number | null | undefined,
  prefix: string
): string => {
  if (id === null || id === undefined || String(id).length === 0) {
    return NOT_PROVIDED;
  }

  const raw = String(id);
  const created = getCreationDateFromId(raw);
  const year = (created ?? new Date()).getFullYear();
  const suffix = raw.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase();

  return `${prefix}-${year}-${suffix.padStart(4, "0")}`;
};

export const getInitials = (name?: string | null): string => {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const titleCase = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export const calculateAge = (dateOfBirth?: string | Date | null): number | null => {
  if (!dateOfBirth) return null;

  const birth = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasHadBirthday) age -= 1;

  return age >= 0 && age < 130 ? age : null;
};

export const formatCount = (value: number): string =>
  value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value);
