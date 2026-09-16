import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import SearchField from "@/components/ui/SearchField";
import { CONTROL_HEIGHT, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import CustomDateRangeInputs from "./toolbar/CustomDateRangeInputs";
import LogFilterSelects from "./toolbar/LogFilterSelects";
import type { DatePreset } from "./toolbar/logDateRange";

export {
  DATE_PRESETS,
  DEFAULT_DATE_PRESET,
  buildDateRange,
  formatDateRangeLabel,
  type DatePreset,
} from "./toolbar/logDateRange";

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

const LogToolbar = ({
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
}: LogToolbarProps) => {
  const palette = useAdminSurfacePalette();

  const filters = (
    <LogFilterSelects
      datePreset={datePreset}
      onDatePresetChange={onDatePresetChange}
      dateRangeLabel={dateRangeLabel}
      role={role}
      onRoleChange={onRoleChange}
      logType={logType}
      onLogTypeChange={onLogTypeChange}
      severity={severity}
      onSeverityChange={onSeverityChange}
      isDesktop={isDesktop}
    />
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

      {!isDesktop && <View className="w-full flex-row flex-wrap gap-2">{filters}</View>}

      {datePreset === "custom" && (
        <CustomDateRangeInputs
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={onCustomFromChange}
          onCustomToChange={onCustomToChange}
        />
      )}
    </View>
  );
};

export default LogToolbar;
