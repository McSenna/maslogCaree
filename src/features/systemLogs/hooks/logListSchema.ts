import type { ListSchema } from "@/lib/listState/listStateCodec";

import { DATE_PRESETS, DEFAULT_DATE_PRESET } from "../components/toolbar/logDateRange";
import { LOG_TYPE_OPTIONS, ROLE_FILTER_OPTIONS, SEVERITY_OPTIONS } from "../constants/systemLogOptions";
import { PAGE_SIZE } from "../constants/logsLayout";

export type LogListFilters = {
  datePreset: string;
  customFrom: string;
  customTo: string;
  role: string;
  logType: string;
  severity: string;
  outcome: string;
};

/** What the system log table keeps in its URL; the search box is kept apart (it can hold a name). */
export const LOG_LIST_SCHEMA: ListSchema<LogListFilters> = {
  fields: {
    datePreset: { kind: "enum", values: DATE_PRESETS, fallback: DEFAULT_DATE_PRESET, param: "range" },
    customFrom: { kind: "date", param: "from" },
    customTo: { kind: "date", param: "to" },
    role: { kind: "enum", values: ROLE_FILTER_OPTIONS, fallback: "all" },
    logType: { kind: "enum", values: LOG_TYPE_OPTIONS, fallback: "all", param: "type" },
    severity: { kind: "enum", values: SEVERITY_OPTIONS, fallback: "all" },
    outcome: { kind: "enum", values: ["all", "success"], fallback: "all" },
  },
  limits: [PAGE_SIZE],
};
