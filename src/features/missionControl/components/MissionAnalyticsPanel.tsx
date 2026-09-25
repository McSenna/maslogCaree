import { Text, View } from "react-native";
import AppointmentStatusBadge from "@/components/status/AppointmentStatusBadge";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";
import type { CategoryAnalyticsRow } from "../hooks/useMissionCatalogue";
import WorkspacePanel from "./WorkspacePanel";

type MissionAnalyticsPanelProps = {
  rows: CategoryAnalyticsRow[];
};

const MissionAnalyticsPanel = ({ rows }: MissionAnalyticsPanelProps) => {
  const colors = useThemeColors();

  return (
    <WorkspacePanel title="This mission at a glance">
      {rows.map((row) => (
        <View
          key={`${row._id.category}-${row._id.status}`}
          style={{ flexDirection: "row", alignItems: "center", gap: SPACING.sm }}
        >
          <Text style={[TYPE.body, { flex: 1, minWidth: 0, color: colors.body }]}>{row._id.category}</Text>
          <AppointmentStatusBadge status={row._id.status} />
          <Text style={[TYPE.bodyStrong, { minWidth: 28, textAlign: "right", color: colors.heading }]}>{row.count}</Text>
        </View>
      ))}
    </WorkspacePanel>
  );
};

export default MissionAnalyticsPanel;
