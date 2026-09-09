import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import SearchField from "@/components/users/SearchField";
import SelectMenu, { type SelectOption } from "@/components/users/SelectMenu";
import { CONTROL_HEIGHT, RADIUS, useUsersPalette } from "@/components/users/usersTheme";
import {
  LOG_TYPE_OPTIONS,
  ROLE_FILTER_OPTIONS,
  SEVERITY_OPTIONS,
  normalizeRoleLabel,
} from "@/services/systemLogService";

export const DATE_PRESETS = ["all", "today", "yesterday", "7d", "30d", "custom"] as const;

/**
 * Preset the log viewer opens on.
 *
 * "all" rather than a rolling window: System Logs is an audit trail, so the
 * unfiltered view is the honest starting point — a narrower default hides older
 * entries from an admin who never opens the filter, which is exactly when a
 * missing record matters most.
 */
export const DEFAULT_DATE_PRESET: DatePreset = "all";
export type DatePreset = (typeof DATE_PRESETS)[number];

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

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function buildDateRange(preset: DatePreset, customFrom: string, customTo: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (preset === "today") {
    return { fromDate: toDateString(today), toDate: toDateString(today) };
  }
  if (preset === "yesterday") {
    const from = new Date(today.getTime() - 86400000);
    return { fromDate: toDateString(from), toDate: toDateString(from) };
  }
  if (preset === "7d") {
    const from = new Date(today.getTime() - 6 * 86400000);
    return { fromDate: toDateString(from), toDate: toDateString(today) };
  }
  if (preset === "30d") {
    const from = new Date(today.getTime() - 29 * 86400000);
    return { fromDate: toDateString(from), toDate: toDateString(today) };
  }
  if (preset === "custom") {
    return { fromDate: customFrom || undefined, toDate: customTo || undefined };
  }
  return { fromDate: undefined, toDate: undefined };
}

function formatLabelDate(value?: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function formatDateRangeLabel(preset: DatePreset, fromDate?: string, toDate?: string): string {
  if (preset === "all") return "All Time";
  if (!fromDate && !toDate) return "Select dates";
  if (fromDate === toDate) return formatLabelDate(fromDate);
  return `${formatLabelDate(fromDate)} – ${formatLabelDate(toDate)}`;
}

type LogToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  datePreset: DatePreset;
  onDatePresetChange: (preset: DatePreset) => void;
  dateRangeLabel: string;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  logType: string;
  onLogTypeChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  isDesktop: boolean;
  onExport?: () => void;
  exporting?: boolean;
};

export default function LogToolbar({
  search,
  onSearchChange,
  datePreset,
  onDatePresetChange,
  dateRangeLabel,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  role,
  onRoleChange,
  logType,
  onLogTypeChange,
  severity,
  onSeverityChange,
  isDesktop,
  onExport,
  exporting = false,
}: LogToolbarProps) {
  // The User Management palette, because these are the User Management
  // controls — both are derived from the same admin base, so the colours are
  // identical either way.
  const palette = useUsersPalette();

  const dateOptions = useMemo<SelectOption<DatePreset>[]>(
    () => [
      { value: "all", label: "All Time" },
      { value: "today", label: "Today" },
      { value: "yesterday", label: "Yesterday" },
      { value: "7d", label: "Last 7 Days" },
      { value: "30d", label: "Last 30 Days" },
      { value: "custom", label: "Custom Range" },
    ],
    []
  );

  const roleOptions = useMemo<SelectOption<string>[]>(
    () =>
      ROLE_FILTER_OPTIONS.map((option) => ({
        value: option,
        label: option === "all" ? "All Roles" : ROLE_LABELS[option] ?? option,
      })),
    []
  );

  const logTypeOptions = useMemo<SelectOption<string>[]>(
    () =>
      LOG_TYPE_OPTIONS.map((option) => ({
        value: option,
        label: option === "all" ? "All Log Types" : option,
      })),
    []
  );

  const severityOptions = useMemo<SelectOption<string>[]>(
    () =>
      SEVERITY_OPTIONS.map((option) => ({
        value: option,
        label: option === "all" ? "All Severities" : SEVERITY_LABELS[option] ?? option,
      })),
    []
  );

  /**
   * Minimum widths are what each label needs in full — "Last 30 Days",
   * "All Log Types", "Appointment Activity" — so nothing truncates to hold the
   * row together, matching how User Management sizes its menus.
   */
  const filters = (
    <>
      <SelectMenu
        label="Filter by date range"
        value={datePreset}
        options={dateOptions}
        onChange={onDatePresetChange}
        displayValue={dateRangeLabel}
        icon="calendar-blank-outline"
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 18, minWidth: 178 } : { flex: 1, minWidth: 150 }}
      />
      <SelectMenu
        label="Filter by role"
        value={role}
        options={roleOptions}
        onChange={onRoleChange}
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 14, minWidth: 140 } : { flex: 1, minWidth: 118 }}
      />
      <SelectMenu
        label="Filter by log type"
        value={logType}
        options={logTypeOptions}
        onChange={onLogTypeChange}
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 16, minWidth: 158 } : { flex: 1, minWidth: 140 }}
      />
      <SelectMenu
        label="Filter by severity"
        value={severity}
        options={severityOptions}
        onChange={onSeverityChange}
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 15, minWidth: 150 } : { flex: 1, minWidth: 132 }}
      />
    </>
  );

  return (
    <View className="w-full gap-3">
      <View className={isDesktop ? "flex-row items-center gap-3" : "w-full"}>
        <SearchField
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search logs by user, action, or module..."
          accessibilityLabel="Search logs by user, action, module, or IP address"
          style={isDesktop ? { flex: 37 } : undefined}
        />

        {isDesktop && (
          <>
            {filters}
            <Pressable
              onPress={onExport}
              disabled={exporting}
              accessibilityRole="button"
              accessibilityLabel="Export logs"
              // Press feedback rides on the class, not on a style callback:
              // react-native-web drops a function-form `style` on Pressable
              // entirely, taking the button's fill and height with it.
              className="flex-row items-center justify-center gap-2 px-5 active:opacity-85"
              style={{
                height: CONTROL_HEIGHT,
                borderRadius: RADIUS.control,
                backgroundColor: palette.primary,
                opacity: exporting ? 0.7 : 1,
              }}
            >
              {exporting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Feather name="download" size={17} color="#FFFFFF" />
              )}
              <Text className="text-[14px] font-semibold text-white">Export Logs</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Export stays desktop-only, as it was: the download it triggers is a
          browser save, and this task is a restyle, not a feature change. */}
      {!isDesktop && <View className="w-full flex-row flex-wrap gap-2">{filters}</View>}

      {datePreset === "custom" && (
        <View className="w-full flex-row flex-wrap gap-3">
          {(
            [
              { value: customFrom, onChange: onCustomFromChange, placeholder: "From (YYYY-MM-DD)", label: "Custom range start date" },
              { value: customTo, onChange: onCustomToChange, placeholder: "To (YYYY-MM-DD)", label: "Custom range end date" },
            ] as const
          ).map((field) => (
            <TextInput
              key={field.label}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={palette.subtle}
              accessibilityLabel={field.label}
              autoCapitalize="none"
              autoCorrect={false}
              className="min-w-0 flex-1 border px-3.5 text-[14px]"
              style={{
                height: CONTROL_HEIGHT,
                borderRadius: RADIUS.control,
                backgroundColor: palette.cardBg,
                borderColor: palette.cardBorder,
                color: palette.body,
                outlineStyle: "none",
              } as never}
            />
          ))}
        </View>
      )}
    </View>
  );
}
