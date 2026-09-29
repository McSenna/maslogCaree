import { useMemo } from "react";
import { MetricCard } from "@/components/dashboard/admin";
import PressableShell from "@/components/cards/PressableShell";
import {
  AttentionStrip,
  MetricRow,
  SplitRow,
  type AttentionItem,
  type DashboardLayout,
} from "@/components/dashboard/kit";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffDashboardData } from "@/services/staffDashboardService";
import type { RoleDashboardConfig } from "../config/roleDashboardConfig";
import {
  ALL_SERVICES,
  activityByService,
  byService,
  serviceShares,
  stockIssueOf,
  urgentWaiting,
  type StaffPeriod,
} from "../model/staffDashboardModel";
import QueueTable from "./QueueTable";
import RecordsTable from "./RecordsTable";
import ServiceShareCard from "./ServiceShareCard";
import StaffFilterBar from "./StaffFilterBar";
import StockWatchTable from "./StockWatchTable";
import TrendCard from "./TrendCard";
import UpcomingTable from "./UpcomingTable";

export type StaffNavigation = {
  toQueue: () => void;
  toInventory: () => void;
};

export type StaffFilters = {
  service: string;
  setService: (service: string) => void;
  period: StaffPeriod;
  setPeriod: (period: StaffPeriod) => void;
};

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export const buildStaffAttention = (
  data: StaffDashboardData,
  config: RoleDashboardConfig,
  go: StaffNavigation
): AttentionItem[] => {
  const items: AttentionItem[] = [];
  const noun = config.personNoun;

  const urgent = urgentWaiting(data.queue);
  if (urgent > 0) {
    items.push({
      key: "urgent",
      icon: "alert-triangle",
      tone: "danger",
      title: count(urgent, `urgent ${noun} in the queue`, `urgent ${noun}s in the queue`),
      detail: "Flagged urgent at triage",
      onPress: go.toQueue,
    });
  }

  if (data.summary.pending > 0) {
    items.push({
      key: "pending",
      icon: "calendar",
      tone: "warning",
      title: count(data.summary.pending, "request to schedule", "requests to schedule"),
      detail: "Approved requests without a slot yet",
      onPress: go.toQueue,
    });
  }

  if (config.inventoryRoute) {
    const issues = data.inventoryAlerts.map((item) => stockIssueOf(item));
    const restock = issues.filter((issue) => issue === "out" || issue === "low").length;
    const expiring = issues.filter((issue) => issue === "expiring").length;
    const anyOut = issues.includes("out");

    if (restock > 0) {
      items.push({
        key: "restock",
        icon: "package",
        tone: anyOut ? "danger" : "warning",
        title: count(restock, "item needs restocking", "items need restocking"),
        detail: anyOut ? "Some are already out of stock" : "At or below the reorder level",
        onPress: go.toInventory,
      });
    }
    if (expiring > 0) {
      items.push({
        key: "expiring",
        icon: "clock",
        tone: "info",
        title: count(expiring, "item expiring soon", "items expiring soon"),
        detail: "Within the next 30 days",
        onPress: go.toInventory,
      });
    }
  }

  return items;
};

const StaffDashboardBody = ({
  palette,
  isDark,
  config,
  data,
  layout,
  filters,
  go,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  config: RoleDashboardConfig;
  data: StaffDashboardData;
  layout: DashboardLayout;
  filters: StaffFilters;
  go: StaffNavigation;
}) => {
  const { isMobile, gap, stackPanels } = layout;
  const { service, period } = filters;

  const multiService = data.services.length > 1;
  // Service badges only earn their space when the rows can differ by service.
  const showService = multiService && service === ALL_SERVICES;
  const showSplit = config.showServiceSplit && multiService;

  const queue = useMemo(() => byService(data.queue, service), [data.queue, service]);
  const upcoming = useMemo(() => byService(data.upcoming, service), [data.upcoming, service]);
  const records = useMemo(() => activityByService(data.recentActivity, service), [data.recentActivity, service]);
  const shares = useMemo(() => serviceShares(data.trend, period, data.services), [data.trend, period, data.services]);

  const metrics = config.metrics.map((spec) => {
    const value = spec.value(data);
    const description = spec.description(data);
    return (
      <PressableShell
        key={spec.key}
        onPress={go.toQueue}
        accessibilityLabel={`${spec.label}: ${value}. ${description}`}
        accessibilityHint="Opens the appointment queue"
        showChevron={false}
      >
        <MetricCard
          palette={palette}
          tone={spec.tone}
          icon={spec.icon}
          label={spec.label}
          description={description}
          value={value}
          progress={spec.progress?.(data)}
          compact={isMobile}
          dense={layout.denseMetrics}
        />
      </PressableShell>
    );
  });

  const upcomingTable = (
    <UpcomingTable
      key="upcoming"
      palette={palette}
      appointments={upcoming}
      showService={showService}
      personNoun={config.personNoun}
      onOpenQueue={go.toQueue}
      fill={!stackPanels}
    />
  );

  return (
    <>
      <AttentionStrip palette={palette} items={buildStaffAttention(data, config, go)} compact={isMobile} />

      <MetricRow columns={layout.metricColumns} gap={gap}>
        {metrics}
      </MetricRow>

      {multiService ? (
        <StaffFilterBar
          palette={palette}
          isDark={isDark}
          services={data.services}
          service={service}
          onServiceChange={filters.setService}
          compact={isMobile}
        />
      ) : null}

      <SplitRow weights={[2, 1]} stacked={stackPanels} gap={gap}>
        <QueueTable
          palette={palette}
          queue={queue}
          showService={showService}
          personNoun={config.personNoun}
          compact={isMobile}
          onOpenQueue={go.toQueue}
          fill={!stackPanels}
        />
        {upcomingTable}
      </SplitRow>

      <SplitRow weights={[2, 1]} stacked={stackPanels} gap={gap}>
        <TrendCard
          palette={palette}
          isDark={isDark}
          config={config}
          services={data.services}
          trend={data.trend}
          period={period}
          onPeriodChange={filters.setPeriod}
          service={service}
          compact={isMobile}
          fill={!stackPanels}
        />
        {showSplit ? (
          <ServiceShareCard
            palette={palette}
            isDark={isDark}
            shares={shares}
            period={period}
            service={service}
            fill={!stackPanels}
          />
        ) : null}
      </SplitRow>

      <SplitRow weights={[2, 1]} stacked={stackPanels} gap={gap}>
        <RecordsTable
          palette={palette}
          activities={records}
          title={config.activityTitle}
          subtitle={config.activitySubtitle}
          personNoun={config.personNoun}
          showService={showService}
          compact={isMobile}
          fill={!stackPanels}
        />
        {config.inventoryRoute ? (
          <StockWatchTable
            palette={palette}
            items={data.inventoryAlerts}
            onOpenInventory={go.toInventory}
            fill={!stackPanels}
          />
        ) : null}
      </SplitRow>
    </>
  );
};

export default StaffDashboardBody;
