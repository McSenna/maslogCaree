// What each summary card on System Logs stands for, as list filters, so a
// click shows the entries the card counted. Windows follow the stats endpoint:
// errors today, warnings over the last 7 days (today included), successful
// actions since the 1st of this month.
import { todayDateKey } from "@/utils/dateFormatter";
import type { DatePreset } from "./logDateRange";

export type LogCardKey = "totalLogs" | "errorsToday" | "warnings" | "successfulActions";
export type LogOutcome = "all" | "success";

export type LogCardFilter = {
  severity: string;
  outcome: LogOutcome;
  datePreset: DatePreset;
  /** Month to date, via the custom range. */
  monthToDate?: boolean;
};

export const LOG_CARD_FILTERS: Record<LogCardKey, LogCardFilter> = {
  totalLogs: { severity: "all", outcome: "all", datePreset: "all" },
  errorsToday: { severity: "error", outcome: "all", datePreset: "today" },
  warnings: { severity: "warning", outcome: "all", datePreset: "7d" },
  successfulActions: { severity: "all", outcome: "success", datePreset: "custom", monthToDate: true },
};

export const LOG_CARD_HINTS: Record<LogCardKey, string> = {
  totalLogs: "Shows every log entry",
  errorsToday: "Shows today's errors",
  warnings: "Shows warnings from the last 7 days",
  successfulActions: "Shows successful actions this month",
};

export const monthToDateRange = () => {
  const today = todayDateKey();
  return { from: `${today.slice(0, 8)}01`, to: today };
};

type CurrentFilters = {
  search: string;
  role: string;
  logType: string;
  severity: string;
  outcome: LogOutcome;
  datePreset: DatePreset;
  customFrom: string;
  customTo: string;
};

/** The card whose filters the list shows, or null for any other mix. */
export const activeLogCard = (current: CurrentFilters): LogCardKey | null => {
  if (current.search || current.role !== "all" || current.logType !== "all") return null;
  const range = monthToDateRange();
  const match = (Object.keys(LOG_CARD_FILTERS) as LogCardKey[]).find((key) => {
    const card = LOG_CARD_FILTERS[key];
    const sameDates = card.monthToDate
      ? current.customFrom === range.from && current.customTo === range.to
      : true;
    return (
      card.severity === current.severity &&
      card.outcome === current.outcome &&
      card.datePreset === current.datePreset &&
      sameDates
    );
  });
  return match ?? null;
};
