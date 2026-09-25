import { useRouter, usePathname, type Href } from "expo-router";
import { View } from "react-native";
import PressableShell from "@/components/cards/PressableShell";
import { MetricCard } from "@/components/dashboard/admin";
import GridCell from "@/features/adminDashboard/components/GridCell";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffDashboardData } from "@/services/staffDashboardService";
import type { MetricSpec } from "../config/roleDashboardConfig";

const StaffMetricGrid = ({
  palette,
  metrics,
  data,
  columns,
  gap,
  compact,
  dense,
}: {
  palette: AdminDashboardPalette;
  metrics: MetricSpec[];
  data: StaffDashboardData;
  columns: 2 | 4;
  gap: number;
  compact: boolean;
  dense: boolean;
}) => {
  const router = useRouter();
  const roleBase = usePathname().split("/")[1] ?? "";

  const cards = metrics.map((spec) => {
    const card = (
      <MetricCard
        key={spec.key}
        palette={palette}
        tone={spec.tone}
        icon={spec.icon}
        label={spec.label}
        description={spec.description(data)}
        value={spec.value(data)}
        compact={compact}
        dense={dense}
      />
    );
    if (!spec.route || !roleBase) return card;
    return (
      <PressableShell
        key={spec.key}
        onPress={() => router.push(`/${roleBase}/${spec.route}` as Href)}
        accessibilityLabel={`${spec.label}: ${spec.value(data)}. ${spec.description(data)}`}
        accessibilityHint="Opens the appointment queue"
      >
        {card}
      </PressableShell>
    );
  });

  if (columns === 4) {
    return (
      <View style={{ flexDirection: "row", gap }}>
        {cards.map((card, index) => (
          <GridCell key={metrics[index].key}>{card}</GridCell>
        ))}
      </View>
    );
  }

  return (
    <View style={{ gap }}>
      <View style={{ flexDirection: "row", gap }}>
        <GridCell>{cards[0]}</GridCell>
        <GridCell>{cards[1]}</GridCell>
      </View>
      <View style={{ flexDirection: "row", gap }}>
        <GridCell>{cards[2]}</GridCell>
        <GridCell>{cards[3]}</GridCell>
      </View>
    </View>
  );
};

export default StaffMetricGrid;
