import SelectMenu from "@/components/ui/SelectMenu";
import { CONTROL_HEIGHT } from "@/design/adminSurfaces";

import type { DatePreset } from "./logDateRange";
import {
  DATE_OPTIONS,
  LOG_TYPE_SELECT_OPTIONS,
  ROLE_OPTIONS,
  SEVERITY_SELECT_OPTIONS,
} from "./logFilterOptions";

type Props = {
  datePreset: DatePreset;
  onDatePresetChange: (preset: DatePreset) => void;
  dateRangeLabel: string;
  role: string;
  onRoleChange: (value: string) => void;
  logType: string;
  onLogTypeChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  isDesktop: boolean;
};

const LogFilterSelects = ({
  datePreset,
  onDatePresetChange,
  dateRangeLabel,
  role,
  onRoleChange,
  logType,
  onLogTypeChange,
  severity,
  onSeverityChange,
  isDesktop,
}: Props) => {
  return (
    <>
      <SelectMenu
        label="Filter by date range"
        value={datePreset}
        options={DATE_OPTIONS}
        onChange={onDatePresetChange}
        displayValue={dateRangeLabel}
        icon="calendar-blank-outline"
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 18, minWidth: 204 } : { flex: 1, minWidth: 172 }}
      />
      <SelectMenu
        label="Filter by role"
        value={role}
        options={ROLE_OPTIONS}
        onChange={onRoleChange}
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 14, minWidth: 162 } : { flex: 1, minWidth: 136 }}
      />
      <SelectMenu
        label="Filter by log type"
        value={logType}
        options={LOG_TYPE_SELECT_OPTIONS}
        onChange={onLogTypeChange}
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 16, minWidth: 206 } : { flex: 1, minWidth: 162 }}
      />
      <SelectMenu
        label="Filter by severity"
        value={severity}
        options={SEVERITY_SELECT_OPTIONS}
        onChange={onSeverityChange}
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 15, minWidth: 172 } : { flex: 1, minWidth: 152 }}
      />
    </>
  );
};

export default LogFilterSelects;
