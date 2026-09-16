import { Text, View } from "react-native";
import type { CategoryAnalyticsRow } from "../hooks/useMissionCatalogue";

type MissionAnalyticsPanelProps = {
  rows: CategoryAnalyticsRow[];
};

const MissionAnalyticsPanel = ({ rows }: MissionAnalyticsPanelProps) => {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <Text className="text-lg font-semibold text-slate-900">Analytics (this mission)</Text>
      {rows.map((row) => (
        <Text
          key={`${row._id.category}-${row._id.status}`}
          className="mt-1 text-sm text-slate-700"
        >
          {row._id.category} · {row._id.status}: {row.count}
        </Text>
      ))}
    </View>
  );
}

export default MissionAnalyticsPanel;