import { useMemo, useState } from "react";
import type { Href } from "expo-router";
import { DashboardErrorState } from "@/components/dashboard/admin";
import {
  DashboardHeader,
  DashboardScroll,
  DashboardSkeleton,
  greetingLine,
  longDate,
  updatedLabel,
  useDashboardLayout,
  useMinuteClock,
  type DashboardAction,
} from "@/components/dashboard/kit";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { useStaffDashboard } from "@/hooks/useStaffDashboard";
import type { StaffDashboardData } from "@/services/staffDashboardService";
import StaffDashboardBody, { type StaffFilters, type StaffNavigation } from "../components/StaffDashboardBody";
import { getRoleDashboardConfig, type RoleDashboardConfig, type StaffRole } from "../config/roleDashboardConfig";
import { ALL_SERVICES, type StaffPeriod } from "../model/staffDashboardModel";

const SKELETON_ROWS = [
  { weights: [2, 1], height: 360 },
  { weights: [2, 1], height: 320 },
];

const todayLine = (data: StaffDashboardData | null, config: RoleDashboardConfig): string => {
  if (!data) return "Loading today's clinic";
  const { today, completedToday } = data.summary;
  const noun = config.personNoun;
  if (today === 0) return `No ${noun}s booked for today`;
  return `${completedToday} of ${today} ${today === 1 ? noun : `${noun}s`} seen`;
};

const StaffDashboardScreen = ({ role }: { role: StaffRole }) => {
  const router = useGuardedNavigation();
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const palette = getAdminDashboardPalette(resolvedTheme);
  const isDark = resolvedTheme === "dark";
  const now = useMinuteClock();

  const layout = useDashboardLayout();
  const { data, loading, refreshing, error, reload, refresh } = useStaffDashboard();
  const config = getRoleDashboardConfig(role);

  const [service, setService] = useState<string>(ALL_SERVICES);
  const [period, setPeriod] = useState<StaffPeriod>("7d");
  const filters: StaffFilters = { service, setService, period, setPeriod };

  const go = useMemo<StaffNavigation>(
    () => ({
      toQueue: () => router.push(config.queueRoute as Href),
      toInventory: () => router.push((config.inventoryRoute ?? config.queueRoute) as Href),
    }),
    [router, config.queueRoute, config.inventoryRoute]
  );

  const primaryAction: DashboardAction = {
    key: "queue",
    label: "Open queue",
    icon: "list",
    onPress: go.toQueue,
    accessibilityHint: "Opens today's appointment queue",
  };
  const secondaryActions: DashboardAction[] = config.secondaryAction
    ? [
        {
          key: "secondary",
          label: config.secondaryAction.label,
          icon: config.secondaryAction.icon,
          onPress: () => router.push(config.secondaryAction!.route as Href),
        },
      ]
    : [];

  return (
    <DashboardScroll
      palette={palette}
      insets={layout.insets}
      refreshing={refreshing}
      onRefresh={refresh}
      onMeasure={layout.measure}
      gap={layout.isMobile ? 16 : 20}
    >
      <DashboardHeader
        palette={palette}
        compact={layout.isMobile}
        title={greetingLine(user?.name, now)}
        subtitle={`${longDate(now)} · ${todayLine(data, config)}`}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        updatedLabel={data ? updatedLabel(data.generatedAt, now) : undefined}
        onRefresh={data ? refresh : undefined}
        refreshing={refreshing}
      />

      {error && data ? (
        <DashboardErrorState palette={palette} onRetry={refresh} retrying={refreshing} message={error} variant="banner" />
      ) : null}

      {loading && !data ? (
        <DashboardSkeleton
          palette={palette}
          compact={layout.isMobile}
          metricColumns={layout.metricColumns}
          gap={layout.gap}
          rows={SKELETON_ROWS}
        />
      ) : null}

      {error && !data && !loading ? <DashboardErrorState palette={palette} onRetry={reload} message={error} /> : null}

      {data ? (
        <StaffDashboardBody
          palette={palette}
          isDark={isDark}
          config={config}
          data={data}
          layout={layout}
          filters={filters}
          go={go}
        />
      ) : null}
    </DashboardScroll>
  );
};

export default StaffDashboardScreen;
