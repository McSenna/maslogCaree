import type { Feather } from "@expo/vector-icons";
import {
  ActivityTrendPanel,
  MetricCard,
  RegistrationTrendPanel,
  RoleDistributionPanel,
} from "@/components/dashboard/admin";
import { AttentionStrip, MetricRow, SplitRow, type AttentionItem } from "@/components/dashboard/kit";
import type { AdminDashboardPalette, MetricTone } from "@/design/adminDashboardTheme";
import type { AdminDashboardData, DashboardActivity, DashboardMetrics } from "@/services/adminDashboardService";
import { ANALYTICS_FLEX, donutSizeForPanel, LEGEND_BESIDE_MIN_WIDTH, PEOPLE_FLEX } from "../constants/dashboardLayout";
import type { AdminDashboardLayout } from "../hooks/useAdminDashboardLayout";
import ActivityLogTable from "./ActivityLogTable";
import RecentUsersTable from "./RecentUsersTable";

type MetricSpec = {
  key: keyof DashboardMetrics;
  growthKey: keyof DashboardMetrics;
  tone: MetricTone;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  description: string;
};

const METRIC_SPECS: MetricSpec[] = [
  {
    key: "totalUsers",
    growthKey: "totalUsersGrowth",
    tone: "blue",
    icon: "users",
    label: "Total users",
    description: "Every registered account",
  },
  {
    key: "activeUsers",
    growthKey: "activeUsersGrowth",
    tone: "green",
    icon: "user-check",
    label: "Active users",
    description: "Verified and able to sign in",
  },
  {
    key: "newUsersLast30Days",
    growthKey: "newUsersGrowth",
    tone: "purple",
    icon: "user-plus",
    label: "New this month",
    description: "Joined in the last 30 days",
  },
  {
    key: "totalPatients",
    growthKey: "totalPatientsGrowth",
    tone: "blue",
    icon: "heart",
    label: "Residents",
    description: "Patients on record",
  },
];

export type AdminNavigation = {
  toUsers: () => void;
  toRegistrations: () => void;
  toSupport: () => void;
  toInventory: () => void;
  toSystemLogs: () => void;
  toActivity: (activity: DashboardActivity) => void;
};

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export const buildAdminAttention = (
  attention: AdminDashboardData["attention"],
  go: AdminNavigation
): AttentionItem[] => {
  const items: (AttentionItem | null)[] = [
    attention.pendingRegistrations > 0
      ? {
          key: "registrations",
          icon: "user-check",
          tone: "warning",
          title: plural(attention.pendingRegistrations, "registration to review", "registrations to review"),
          detail: "ID checks waiting for your decision",
          onPress: go.toRegistrations,
        }
      : null,
    attention.openSupportTickets > 0
      ? {
          key: "support",
          icon: "life-buoy",
          tone: "info",
          title: plural(attention.openSupportTickets, "open support request", "open support requests"),
          detail: "Waiting for a reply from the team",
          onPress: go.toSupport,
        }
      : null,
    attention.lowStockItems > 0
      ? {
          key: "low-stock",
          icon: "package",
          tone: "danger",
          title: plural(attention.lowStockItems, "item low on stock", "items low on stock"),
          detail: "At or below the reorder level",
          onPress: go.toInventory,
        }
      : null,
    attention.expiringItems > 0
      ? {
          key: "expiring",
          icon: "clock",
          tone: "warning",
          title: plural(attention.expiringItems, "item expiring soon", "items expiring soon"),
          detail: "Within the next 30 days",
          onPress: go.toInventory,
        }
      : null,
  ];
  return items.filter((item): item is AttentionItem => item !== null);
};

const DashboardBody = ({
  data,
  palette,
  isDark,
  layout,
  go,
}: {
  data: AdminDashboardData;
  palette: AdminDashboardPalette;
  isDark: boolean;
  layout: AdminDashboardLayout;
  go: AdminNavigation;
}) => {
  const { isMobile, gap, stackPanels } = layout;
  const distributionStacked = layout.chartPanelWidth < LEGEND_BESIDE_MIN_WIDTH;

  return (
    <>
      <AttentionStrip palette={palette} items={buildAdminAttention(data.attention, go)} compact={isMobile} />

      <MetricRow columns={layout.metricColumns} gap={gap}>
        {METRIC_SPECS.map((spec) => (
          <MetricCard
            key={spec.key}
            palette={palette}
            tone={spec.tone}
            icon={spec.icon}
            label={spec.label}
            description={spec.description}
            value={data.metrics[spec.key]}
            growth={data.metrics[spec.growthKey]}
            compact={isMobile}
            dense={layout.denseMetrics}
          />
        ))}
      </MetricRow>

      <SplitRow weights={[ANALYTICS_FLEX.registrations, ANALYTICS_FLEX.activity]} stacked={stackPanels} gap={gap}>
        <RegistrationTrendPanel
          palette={palette}
          trend={data.registrationTrend}
          compact={isMobile}
          fill={!stackPanels}
        />
        <ActivityTrendPanel palette={palette} trend={data.activityTrend} compact={isMobile} fill={!stackPanels} />
      </SplitRow>

      <SplitRow weights={[PEOPLE_FLEX.users, PEOPLE_FLEX.distribution]} stacked={stackPanels} gap={gap}>
        <RecentUsersTable
          palette={palette}
          isDark={isDark}
          users={data.recentUsers}
          compact={isMobile}
          onViewAll={go.toUsers}
          fill={!stackPanels}
        />
        <RoleDistributionPanel
          palette={palette}
          distribution={data.roleDistribution}
          stacked={distributionStacked}
          size={distributionStacked ? 180 : donutSizeForPanel(layout.chartPanelWidth)}
          fill={!stackPanels}
        />
      </SplitRow>

      <ActivityLogTable
        palette={palette}
        isDark={isDark}
        activities={data.recentActivities}
        compact={isMobile}
        onViewAll={go.toSystemLogs}
        onOpenActivity={go.toActivity}
      />
    </>
  );
};

export default DashboardBody;
