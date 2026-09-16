import { isDateKey, shiftDateKey, todayDateKey } from "@/utils/dateFormatter";

export const DATE_PRESETS = ["all", "today", "yesterday", "7d", "30d", "custom"] as const;

export const DEFAULT_DATE_PRESET: DatePreset = "all";
export type DatePreset = (typeof DATE_PRESETS)[number];

export const buildDateRange = (
  preset: DatePreset,
  customFrom: string,
  customTo: string
): { fromDay?: string; toDay?: string } => {
  const today = todayDateKey();

  if (preset === "today") {
    return { fromDay: today, toDay: today };
  }
  if (preset === "yesterday") {
    const day = shiftDateKey(today, -1);
    return { fromDay: day, toDay: day };
  }
  if (preset === "7d") {
    return { fromDay: shiftDateKey(today, -6), toDay: today };
  }
  if (preset === "30d") {
    return { fromDay: shiftDateKey(today, -29), toDay: today };
  }
  if (preset === "custom") {
    return {
      fromDay: isDateKey(customFrom) ? customFrom : undefined,
      toDay: isDateKey(customTo) ? customTo : undefined,
    };
  }
  return { fromDay: undefined, toDay: undefined };
};

const formatLabelDate = (value?: string): string => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatDateRangeLabel = (
  preset: DatePreset,
  fromDate?: string,
  toDate?: string
): string => {
  if (preset === "all") return "All Time";
  if (!fromDate && !toDate) return "Select dates";
  if (fromDate === toDate) return formatLabelDate(fromDate);
  return `${formatLabelDate(fromDate)} – ${formatLabelDate(toDate)}`;
};
