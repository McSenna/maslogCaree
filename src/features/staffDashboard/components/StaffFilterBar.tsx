import { Text, View } from "react-native";
import { FilterChips, type ChipOption } from "@/components/dashboard/kit";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import { serviceColor } from "@/design/serviceColors";
import type { DashboardService } from "@/services/staffDashboardService";
import { ALL_SERVICES } from "../model/staffDashboardModel";

/**
 * The service filter for everything below the overview cards: queue, schedule, charts and records.
 * Only shown to roles that cover more than one service.
 */
const StaffFilterBar = ({
  palette,
  isDark,
  services,
  service,
  onServiceChange,
  compact,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  services: DashboardService[];
  service: string;
  onServiceChange: (service: string) => void;
  compact: boolean;
}) => {
  const options: ChipOption<string>[] = [
    { value: ALL_SERVICES, label: "All services" },
    ...services.map((entry) => ({
      value: entry.key,
      label: entry.label,
      swatch: serviceColor(entry.key, isDark, palette.primary),
    })),
  ];

  return (
    <View
      className={compact ? "gap-2" : "flex-row flex-wrap items-center"}
      style={compact ? undefined : { gap: 12 }}
    >
      <Text className="text-[13px] font-semibold" style={{ color: palette.muted }}>
        Show
      </Text>
      <FilterChips palette={palette} label="Show service" value={service} options={options} onChange={onServiceChange} />
    </View>
  );
};

export default StaffFilterBar;
