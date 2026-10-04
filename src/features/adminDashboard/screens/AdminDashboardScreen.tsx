import { useMemo } from "react";
import { DashboardErrorState } from "@/components/dashboard/admin";
import {
  DashboardHeader,
  DashboardScroll,
  DashboardSkeleton,
  greetingLine,
  longDate,
  useMinuteClock,
  type DashboardAction,
} from "@/components/dashboard/kit";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { useRealtimeRefetch } from "@/hooks/realtime/useRealtimeRefetch";
import type { AdminDashboardData } from "@/services/adminDashboardService";
import DashboardBody, { type AdminNavigation } from "../components/DashboardBody";
import { useAdminDashboardLayout } from "../hooks/useAdminDashboardLayout";

// Everything the cards, attention strip and recent tables are computed from.
const DASHBOARD_SOURCES = [
  "user",
  "userRequest",
  "appointment",
  "adminSupportTicket",
  "inventoryItem",
  "systemLog",
] as const;

const SKELETON_ROWS = [
  { weights: [1.6, 1], height: 340 },
  { weights: [1.5, 1], height: 380 },
];

const statusLine = (data: AdminDashboardData | null): string => {
  if (!data) return "Loading today's overview";
  const { pendingRegistrations, openSupportTickets, lowStockItems, expiringItems } = data.attention;
  const waiting = pendingRegistrations + openSupportTickets + lowStockItems + expiringItems;
  if (waiting === 0) return "Nothing is waiting on you";
  return `${waiting} ${waiting === 1 ? "item needs" : "items need"} your attention`;
};

const AdminDashboardScreen = () => {
  const router = useGuardedNavigation();
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const palette = getAdminDashboardPalette(resolvedTheme);
  const isDark = resolvedTheme === "dark";
  const now = useMinuteClock();

  const layout = useAdminDashboardLayout();
  const { data, loading, refreshing, error, reload, refresh, poll } = useAdminDashboard();
  // Live: a quiet reload whenever something the dashboard counts changes,
  // instead of the 30-second poll it used to run.
  useRealtimeRefetch(DASHBOARD_SOURCES, poll, { enabled: Boolean(data) });

  const go = useMemo<AdminNavigation>(
    () => ({
      toUsers: () => router.push("/admin/users"),
      toRegistrations: () => router.push("/admin/users?section=requests" as never),
      toSupport: () => router.push("/admin/support"),
      toInventory: () => router.push("/admin/inventory"),
      toUserList: (list) => router.push(`/admin/users?${list}` as never),
    }),
    [router]
  );

  const pending = data?.attention.pendingRegistrations ?? 0;
  const primaryAction: DashboardAction =
    pending > 0
      ? {
          key: "review",
          label: "Review registrations",
          icon: "user-check",
          onPress: go.toRegistrations,
          accessibilityHint: `${pending} waiting for a decision`,
        }
      : { key: "users", label: "Manage users", icon: "users", onPress: go.toUsers };

  const secondaryActions: DashboardAction[] = [
    {
      key: "announce",
      label: "New announcement",
      icon: "edit-3",
      onPress: () => router.push("/admin/announcements?compose=1" as never),
      showOnPhone: true,
    },
    { key: "support", label: "Support inbox", icon: "life-buoy", onPress: go.toSupport, showOnPhone: true },
  ];

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
        subtitle={`${longDate(now)} · ${statusLine(data)}`}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
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

      {data ? <DashboardBody data={data} palette={palette} isDark={isDark} layout={layout} go={go} /> : null}
    </DashboardScroll>
  );
};

export default AdminDashboardScreen;
