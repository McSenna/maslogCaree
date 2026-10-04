import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { formatCalendarDay } from "../masterlistLabels";
import type { ResidentIdentity } from "../types";

type Props = {
  resident: ResidentIdentity;
  total: number;
  serviceCounts: Record<string, number> | null;
  serviceLabel: (key: string) => string;
  onClear: () => void;
};

/** Shown while the list is one person's history: who, how many, and by service. */
const HistoryBanner = ({ resident, total, serviceCounts, serviceLabel, onClear }: Props) => {
  const palette = useAdminSurfacePalette();
  const surface = { backgroundColor: palette.cardBg, borderColor: palette.cardBorder };
  const breakdown = Object.entries(serviceCounts ?? {})
    .map(([key, count]) => `${serviceLabel(key)} ${count}`)
    .join(", ");

  return (
    <View className="flex-row flex-wrap items-center justify-between gap-3 rounded-panel border px-4 py-3" style={surface}>
      <View className="min-w-0 flex-1 gap-0.5" accessibilityRole="summary">
        <Text className="text-[14px] font-semibold text-ink">{`Medical history of ${resident.fullName}`}</Text>
        <Text className="text-[12.5px] text-text2">
          {[`Born ${formatCalendarDay(resident.dateOfBirth)}`, `${total} ${total === 1 ? "record" : "records"}`, breakdown]
            .filter(Boolean)
            .join(". ")}
        </Text>
      </View>
      <DashboardButton palette={palette} size="sm" variant="secondary" icon="x" label="Show all records" onPress={onClear} />
    </View>
  );
};

export default HistoryBanner;
