import type { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import { MetricCard } from "@/components/dashboard/admin";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { DashboardMetrics } from "@/services/adminDashboardService";
import GridCell from "./GridCell";

type MetricTone = "blue" | "green" | "pink" | "purple";

type MetricSpec = {
  key: keyof DashboardMetrics;
  growthKey: keyof DashboardMetrics;
  tone: MetricTone;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  description: string;
};

/**
 * The four headline figures, in the order the design fixes them.
 *
 * A list rather than four near-identical blocks of markup: they differ only in
 * which field they read and what colour they wear.
 */
const METRIC_SPECS: MetricSpec[] = [
  {
    key: "totalUsers",
    growthKey: "totalUsersGrowth",
    tone: "blue",
    icon: "users",
    label: "Total Users",
    description: "All registered users",
  },
  {
    key: "activeUsers",
    growthKey: "activeUsersGrowth",
    tone: "green",
    icon: "user-check",
    label: "Active Users",
    description: "Verified accounts",
  },
  {
    key: "newUsersLast30Days",
    growthKey: "newUsersGrowth",
    tone: "pink",
    icon: "user-plus",
    label: "New Users",
    description: "Added in the last 30 days",
  },
  {
    key: "totalPatients",
    growthKey: "totalPatientsGrowth",
    tone: "purple",
    icon: "file-text",
    label: "Total Patients",
    description: "Residents on record",
  },
];

type DashboardMetricGridProps = {
  metrics: DashboardMetrics;
  palette: AdminDashboardPalette;
  columns: 2 | 4;
  gap: number;
  compact: boolean;
  dense: boolean;
};

/** The metric row: four across where there is room, otherwise a 2 x 2 grid. */
export default function DashboardMetricGrid({
  metrics,
  palette,
  columns,
  gap,
  compact,
  dense,
}: DashboardMetricGridProps) {
  const cards = METRIC_SPECS.map((spec) => (
    <MetricCard
      key={spec.key}
      palette={palette}
      tone={spec.tone}
      icon={spec.icon}
      label={spec.label}
      description={spec.description}
      value={metrics[spec.key]}
      growth={metrics[spec.growthKey]}
      compact={compact}
      dense={dense}
    />
  ));

  if (columns === 4) {
    return (
      <View style={{ flexDirection: "row", gap }}>
        {cards.map((card, index) => (
          <GridCell key={METRIC_SPECS[index].key}>{card}</GridCell>
        ))}
      </View>
    );
  }

  // 2 x 2: Total Users / Active Users, then New Users / Total Patients.
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
}
