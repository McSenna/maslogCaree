import type { SelectOption } from "@/components/ui/SelectMenu";
import {
  LOG_TYPE_OPTIONS,
  ROLE_FILTER_OPTIONS,
  SEVERITY_OPTIONS,
  normalizeRoleLabel,
} from "@/features/systemLogs/services/systemLogService";

import type { DatePreset } from "./logDateRange";

const SEVERITY_LABELS: Record<string, string> = {
  info: "Info",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

const ROLE_LABELS: Record<string, string> = {
  admin: normalizeRoleLabel("admin"),
  doctor: normalizeRoleLabel("doctor"),
  midwife: normalizeRoleLabel("midwife"),
  bhw: normalizeRoleLabel("bhw"),
  resident: normalizeRoleLabel("resident"),
};

export const DATE_OPTIONS: SelectOption<DatePreset>[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

export const ROLE_OPTIONS: SelectOption<string>[] = ROLE_FILTER_OPTIONS.map((option) => ({
  value: option,
  label: option === "all" ? "All Roles" : ROLE_LABELS[option] ?? option,
}));

export const LOG_TYPE_SELECT_OPTIONS: SelectOption<string>[] = LOG_TYPE_OPTIONS.map(
  (option) => ({
    value: option,
    label: option === "all" ? "All Log Types" : option,
  })
);

export const SEVERITY_SELECT_OPTIONS: SelectOption<string>[] = SEVERITY_OPTIONS.map(
  (option) => ({
    value: option,
    label: option === "all" ? "All Severities" : SEVERITY_LABELS[option] ?? option,
  })
);
