import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, useWindowDimensions, View } from "react-native";
import { useRouter } from "expo-router";
import { ROLE_LAYOUT_PADDING } from "@/components/layout/RoleLayout";
// Read from the sidebar itself rather than copied, so the two cannot drift the
// next time its width changes.
import { SIDEBAR_WIDTH } from "@/components/navigation/sidebar/sidebarTheme";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import {
  DASHBOARD_BREAKPOINTS,
  getAdminDashboardPalette,
} from "@/design/adminDashboardTheme";
import {
  ActivityTrendPanel,
  AdminDashboardSkeleton,
  DashboardErrorState,
  DashboardIntro,
  MetricCard,
  PanelCard,
  RecentActivitiesPanel,
  RecentUsersPanel,
  RegistrationTrendPanel,
  RoleDonutChart,
} from "@/components/dashboard/admin";

/** Mobile shows a deliberately shorter feed than the desktop panels. */
const MOBILE_ACTIVITY_COUNT = 2;
const MOBILE_USER_COUNT = 3;

/**
 * Relative panel widths at three columns. Recent Users carries the most content
 * per row (name, email, role, status, menu) so it takes the extra space.
 */
const PANEL_FLEX = { distribution: 1, users: 1.18, activities: 0.92 };

/** Narrower than this, the donut's legend goes under the chart instead of beside it. */
const LEGEND_BESIDE_MIN_WIDTH = 340;

/** Narrower than this, a recent-user row stacks its badge and status under the name. */
const USER_ROW_SINGLE_LINE_MIN_WIDTH = 400;


/** At or below this the metric cards trim type and icons to stay 2 x 2. */
const DENSE_METRIC_MAX_WIDTH = 370;

/**
 * Grid cell.
 *
 * Columns are flex weights rather than measured pixel widths: flexbox divides
 * the row exactly, so a cell can never overflow its row or wrap onto the next
 * one while a layout pass is still settling.
 */
function Cell({ flex = 1, children }: { flex?: number; children: React.ReactNode }) {
  return <View style={{ flex, minWidth: 0 }}>{children}</View>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const palette = useMemo(
    () => getAdminDashboardPalette(resolvedTheme),
    [resolvedTheme]
  );
  const isDark = resolvedTheme === "dark";

  const { width: windowWidth } = useWindowDimensions();
  // The mobile content order is tied to the same breakpoint the shell uses to
  // swap the sidebar for the bottom nav, so the two never disagree.
  const isMobile = windowWidth < DASHBOARD_BREAKPOINTS.mobile;

  const denseMetrics = windowWidth <= DENSE_METRIC_MAX_WIDTH;

  const layoutPadding = isMobile ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;
  const gap = isMobile ? 12 : 16;

  // Spacing the dashboard wants from the edge of the content area, minus what
  // the shell already applies — so the two never stack into a double gutter.
  const gutter = Math.max(
    0,
    (isMobile ? 16 : windowWidth >= 1024 ? 32 : 24) - layoutPadding.horizontal
  );
  const paddingTop = Math.max(0, (isMobile ? 16 : 24) - layoutPadding.top);
  const paddingBottom = Math.max(0, (isMobile ? 28 : 32) - layoutPadding.bottom);

  const { data, loading, refreshing, error, reload, refresh } = useAdminDashboard();

  /**
   * How many columns fit follows the width the dashboard actually has, not the
   * window: on desktop the sidebar takes its own slice, and deciding from
   * window width alone would squeeze three panels into a space that fits two.
   *
   * The measuring wrapper is a plain View with an explicit width: NativeWind's
   * styled wrapper consumes onLayout, and an explicit width stops a child that
   * overflows mid-layout from widening the very box being measured.
   */
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const availableWidth =
    measuredWidth ||
    Math.max(
      280,
      windowWidth -
        layoutPadding.horizontal * 2 -
        (isMobile ? 0 : SIDEBAR_WIDTH) -
        gutter * 2
    );

  const metricColumns: 2 | 4 =
    isMobile || availableWidth < DASHBOARD_BREAKPOINTS.fourMetricColumns ? 2 : 4;

  const panelColumns: 1 | 2 | 3 = isMobile
    ? 1
    : availableWidth >= DASHBOARD_BREAKPOINTS.threePanelColumns
      ? 3
      : availableWidth >= DASHBOARD_BREAKPOINTS.twoPanelColumns
        ? 2
        : 1;

  const goToUsers = useCallback(() => router.push("/admin/users" as any), [router]);
  const goToSystemLogs = useCallback(
    () => router.push("/admin/system-logs" as any),
    [router]
  );

  const metrics = data?.metrics;
  const recentUsers = useMemo(() => {
    const list = data?.recentUsers ?? [];
    return isMobile ? list.slice(0, MOBILE_USER_COUNT) : list;
  }, [data?.recentUsers, isMobile]);
  const recentActivities = useMemo(() => {
    const list = data?.recentActivities ?? [];
    return isMobile ? list.slice(0, MOBILE_ACTIVITY_COUNT) : list;
  }, [data?.recentActivities, isMobile]);

  const totalUsersCard = metrics ? (
    <MetricCard
      palette={palette}
      tone="blue"
      icon="users"
      label="Total Users"
      description="All registered users"
      value={metrics.totalUsers}
      growth={metrics.totalUsersGrowth}
      compact={isMobile}
      dense={denseMetrics}
    />
  ) : null;

  const activeUsersCard = metrics ? (
    <MetricCard
      palette={palette}
      tone="green"
      icon="user-check"
      label="Active Users"
      description="Verified accounts"
      value={metrics.activeUsers}
      growth={metrics.activeUsersGrowth}
      compact={isMobile}
      dense={denseMetrics}
    />
  ) : null;

  const newUsersCard = metrics ? (
    <MetricCard
      palette={palette}
      tone="pink"
      icon="user-plus"
      label="New Users"
      description="Added in the last 30 days"
      value={metrics.newUsersLast30Days}
      growth={metrics.newUsersGrowth}
      compact={isMobile}
      dense={denseMetrics}
    />
  ) : null;

  const totalPatientsCard = metrics ? (
    <MetricCard
      palette={palette}
      tone="purple"
      icon="file-text"
      label="Total Patients"
      description="Residents on record"
      value={metrics.totalPatients}
      growth={metrics.totalPatientsGrowth}
      compact={isMobile}
      dense={denseMetrics}
    />
  ) : null;

  const metricGrid =
    metricColumns === 4 ? (
      <View style={{ flexDirection: "row", gap }}>
        <Cell>{totalUsersCard}</Cell>
        <Cell>{activeUsersCard}</Cell>
        <Cell>{newUsersCard}</Cell>
        <Cell>{totalPatientsCard}</Cell>
      </View>
    ) : (
      // 2 x 2: Total Users / Active Users, then New Users / Total Patients.
      <View style={{ gap }}>
        <View style={{ flexDirection: "row", gap }}>
          <Cell>{totalUsersCard}</Cell>
          <Cell>{activeUsersCard}</Cell>
        </View>
        <View style={{ flexDirection: "row", gap }}>
          <Cell>{newUsersCard}</Cell>
          <Cell>{totalPatientsCard}</Cell>
        </View>
      </View>
    );

  const inColumns = !isMobile && panelColumns > 1;

  /**
   * Widths the panels will actually get from the flex row above, derived from
   * the same weights the layout uses. They only pick a row style — flexbox
   * still does the sizing — so being a few pixels out is harmless.
   */
  const panelRowWidth = availableWidth - gap * (panelColumns - 1);
  const panelWeightTotal =
    panelColumns === 3
      ? PANEL_FLEX.distribution + PANEL_FLEX.users + PANEL_FLEX.activities
      : panelColumns === 2
        ? PANEL_FLEX.distribution + PANEL_FLEX.users
        : 1;
  const chartPanelWidth =
    panelColumns === 1
      ? availableWidth
      : (panelRowWidth * PANEL_FLEX.distribution) / panelWeightTotal;
  const usersPanelWidth =
    panelColumns === 1
      ? availableWidth
      : (panelRowWidth * PANEL_FLEX.users) / panelWeightTotal;

  const distributionPanel = (
    // centerContent: this panel is stretched to the row's tallest card but
    // holds a single visual, so its content is centred in that height rather
    // than pinned to the top above a gap.
    <PanelCard palette={palette} title="User Distribution by Role" fill={inColumns} centerContent>
      <RoleDonutChart
        palette={palette}
        distribution={data?.roleDistribution ?? []}
        stacked={isMobile || chartPanelWidth < LEGEND_BESIDE_MIN_WIDTH}
        size={isMobile ? 180 : chartPanelWidth >= 420 ? 180 : 160}
      />
    </PanelCard>
  );

  const usersPanel = (
    <RecentUsersPanel
      palette={palette}
      isDark={isDark}
      users={recentUsers}
      compact={isMobile || usersPanelWidth < USER_ROW_SINGLE_LINE_MIN_WIDTH}
      onViewAll={goToUsers}
      fill={inColumns}
    />
  );

  const activitiesPanel = (
    <RecentActivitiesPanel
      palette={palette}
      activities={recentActivities}
      compact={isMobile}
      onViewAll={goToSystemLogs}
      fill={panelColumns === 3}
    />
  );

  const registrationPanel = (
    <RegistrationTrendPanel
      palette={palette}
      trend={data?.registrationTrend ?? []}
      compact={isMobile}
      fill={!isMobile}
    />
  );

  const activityTrendPanel = (
    <ActivityTrendPanel
      palette={palette}
      trend={data?.activityTrend ?? []}
      compact={isMobile}
      fill={!isMobile}
    />
  );

  /**
   * Analytics row: the registration line takes roughly two thirds against the
   * weekly activity bars. Below the two-panel threshold the pair stacks, since
   * a 7-bar chart in half of a narrow column is unreadable.
   */
  const analyticsRow =
    !isMobile && availableWidth >= DASHBOARD_BREAKPOINTS.twoPanelColumns ? (
      <View style={{ flexDirection: "row", gap }}>
        <Cell flex={1.9}>{registrationPanel}</Cell>
        <Cell flex={1}>{activityTrendPanel}</Cell>
      </View>
    ) : (
      <View style={{ gap }}>
        {registrationPanel}
        {activityTrendPanel}
      </View>
    );

  const body = data ? (
    isMobile ? (
      // Mobile order: metrics → analytics → activities → users → distribution,
      // matching the requested mobile hierarchy.
      <View className="gap-4">
        {metricGrid}
        {analyticsRow}
        {activitiesPanel}
        {usersPanel}
        {distributionPanel}
      </View>
    ) : (
      <View className="gap-5">
        {metricGrid}

        {analyticsRow}

        {panelColumns === 1 ? (
          <View className="gap-5">
            {distributionPanel}
            {usersPanel}
            {activitiesPanel}
          </View>
        ) : (
          <View className="gap-5">
            <View style={{ flexDirection: "row", gap }}>
              <Cell flex={PANEL_FLEX.distribution}>{distributionPanel}</Cell>
              <Cell flex={PANEL_FLEX.users}>{usersPanel}</Cell>
              {panelColumns === 3 ? (
                <Cell flex={PANEL_FLEX.activities}>{activitiesPanel}</Cell>
              ) : null}
            </View>
            {/* Two columns cannot hold the activity rows legibly, so the feed
                runs full width underneath instead. */}
            {panelColumns === 2 ? activitiesPanel : null}
          </View>
        )}
      </View>
    )
  ) : null;

  return (
    <View className="flex-1">
      {/* The tinted page runs edge to edge behind the shell's padding. It is
          positioned rather than negatively margined so it cannot feed back into
          the flex row that holds the sidebar. */}
      <View
        style={{
          position: "absolute",
          top: -layoutPadding.top,
          bottom: -layoutPadding.bottom,
          left: -layoutPadding.horizontal,
          right: -layoutPadding.horizontal,
          backgroundColor: palette.pageBg,
        }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: gutter,
          paddingTop,
          paddingBottom,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
      >
        <View
          style={{ width: "100%", maxWidth: 1920, alignSelf: "center", minWidth: 0 }}
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== measuredWidth) setMeasuredWidth(next);
          }}
        >
          <View className={isMobile ? "gap-4" : "gap-5"}>
            <DashboardIntro palette={palette} compact={isMobile} />

            {/* A failed refresh keeps the last good dashboard on screen and
                explains itself in a banner; only a cold failure takes the page. */}
            {error && data ? (
              <DashboardErrorState palette={palette} onRetry={reload} variant="banner" />
            ) : null}

            {loading && !data ? (
              <AdminDashboardSkeleton
                palette={palette}
                compact={isMobile}
                metricColumns={metricColumns}
                panelColumns={panelColumns}
                gap={gap}
              />
            ) : null}

            {error && !data ? (
              <DashboardErrorState palette={palette} onRetry={reload} />
            ) : null}

            {body}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
