export const MINUTE_STEP = 5;

export type TimeParts = { hour12: number; minute: number; isPm: boolean };

const LAST_SLOT_MINUTES = 24 * 60 - MINUTE_STEP;

export const parseTimeParts = (time: string): TimeParts => {
  const [rawHour, rawMinute] = String(time).split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  const valid =
    rawHour !== undefined &&
    rawHour !== "" &&
    rawMinute !== undefined &&
    rawMinute !== "" &&
    Number.isFinite(hour) &&
    Number.isFinite(minute);

  const total = valid
    ? Math.min(24 * 60 - 1, Math.max(0, hour * 60 + minute))
    : 8 * 60;

  const snapped = Math.min(LAST_SLOT_MINUTES, Math.round(total / MINUTE_STEP) * MINUTE_STEP);
  const snappedHour = Math.floor(snapped / 60);

  return {
    hour12: snappedHour % 12 === 0 ? 12 : snappedHour % 12,
    minute: snapped % 60,
    isPm: snappedHour >= 12,
  };
};

export const formatTimeParts = ({ hour12, minute, isPm }: TimeParts): string => {
  const base = hour12 % 12;
  const hour24 = isPm ? base + 12 : base;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};
