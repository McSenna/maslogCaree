import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { activityVisual } from "@/components/dashboard/admin/activityVisual";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable, SegmentedControl, StatusPill, type TableColumn } from "@/components/dashboard/kit";
import { ROLE_LABELS, type AdminDashboardPalette } from "@/design/adminDashboardTheme";
import {
  formatActivityActor,
  formatActivityTitle,
  type DashboardActivity,
} from "@/services/adminDashboardService";

type EventFilter = "all" | "signins" | "failed";

const VISIBLE_ROWS = 8;

const SIGN_IN_ACTIONS = new Set([
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "RESIDENT_WEB_LOGIN_BLOCKED",
  "PLATFORM_ACCESS_DENIED",
]);

const matches = (activity: DashboardActivity, filter: EventFilter) =>
  filter === "all" ||
  (filter === "signins" ? SIGN_IN_ACTIONS.has(activity.action) : activity.success === false);

const whenLabel = (iso: string, now: Date = new Date()): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const sameDay = date.toDateString() === now.toDateString();
  return sameDay ? `Today, ${time}` : `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${time}`;
};

const platformLabel = (platform?: string) =>
  platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "";

const roleLabel = (role: string) => ROLE_LABELS[role] ?? "";

const EventCell = ({
  palette,
  isDark,
  activity,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  activity: DashboardActivity;
}) => {
  const visual = activityVisual(activity.action);
  return (
    <View className="min-w-0 flex-row items-center gap-2.5" style={{ alignSelf: "stretch" }}>
      <View
        className="h-8 w-8 shrink-0 items-center justify-center rounded-full"
        // Light tints glare on dark cards; a translucent wash of the icon colour works on both.
        style={{ backgroundColor: isDark ? `${visual.color}29` : visual.tint }}
      >
        <Feather name={visual.icon} size={15} color={visual.color} />
      </View>
      <Text
        className="min-w-0 flex-1 text-[13.5px] font-semibold"
        numberOfLines={1}
        style={{ color: palette.heading }}
      >
        {formatActivityTitle(activity.action)}
      </Text>
    </View>
  );
};

const ResultPill = ({ palette, activity }: { palette: AdminDashboardPalette; activity: DashboardActivity }) =>
  activity.success === false ? (
    <StatusPill palette={palette} tone="danger" icon="x" label="Failed" />
  ) : (
    <StatusPill palette={palette} tone="success" icon="check" label="OK" />
  );

const ActivityLogTable = ({
  palette,
  isDark,
  activities,
  compact,
  onViewAll,
  onOpenActivity,
}: {
  palette: AdminDashboardPalette;
  isDark: boolean;
  activities: DashboardActivity[];
  compact: boolean;
  onViewAll: () => void;
  onOpenActivity: (activity: DashboardActivity) => void;
}) => {
  const [filter, setFilter] = useState<EventFilter>("all");

  const counts = useMemo(
    () => ({
      all: activities.length,
      signins: activities.filter((activity) => matches(activity, "signins")).length,
      failed: activities.filter((activity) => matches(activity, "failed")).length,
    }),
    [activities]
  );
  const rows = useMemo(
    () => activities.filter((activity) => matches(activity, filter)).slice(0, VISIBLE_ROWS),
    [activities, filter]
  );

  const columns: TableColumn<DashboardActivity>[] = [
    {
      key: "event",
      header: "Event",
      flex: 1.7,
      render: (activity) => <EventCell palette={palette} isDark={isDark} activity={activity} />,
    },
    {
      key: "actor",
      header: "By",
      flex: 1.3,
      render: (activity) => (
        <View className="min-w-0" style={{ alignSelf: "stretch" }}>
          <Text className="text-[13px] font-medium" numberOfLines={1} style={{ color: palette.body }}>
            {formatActivityActor(activity)}
          </Text>
          {roleLabel(activity.role) ? (
            <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
              {roleLabel(activity.role)}
            </Text>
          ) : null}
        </View>
      ),
    },
    {
      key: "platform",
      header: "Platform",
      width: 80,
      minTableWidth: 760,
      render: (activity) => (
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.muted }}>
          {platformLabel(activity.platform)}
        </Text>
      ),
    },
    {
      key: "when",
      header: "When",
      width: 136,
      minTableWidth: 560,
      render: (activity) => (
        <Text
          className="text-[12.5px] font-medium"
          numberOfLines={1}
          style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}
        >
          {whenLabel(activity.createdAt)}
        </Text>
      ),
    },
    {
      key: "result",
      header: "Result",
      width: 84,
      align: "right",
      render: (activity) => <ResultPill palette={palette} activity={activity} />,
    },
  ];

  const filterControl = (
    <SegmentedControl
      palette={palette}
      label="Show events"
      value={filter}
      onChange={setFilter}
      fill={compact}
      options={[
        { value: "all", label: "All", count: counts.all },
        { value: "signins", label: "Sign-ins", count: counts.signins },
        { value: "failed", label: "Failed", count: counts.failed },
      ]}
    />
  );

  return (
    <PanelCard
      palette={palette}
      title="System activity log"
      icon="shield"
      subtitle="Sign-ins and account changes"
      onViewAll={onViewAll}
      viewAllLabel="System logs"
      headerRight={compact ? undefined : filterControl}
    >
      {compact ? <View className="mb-3">{filterControl}</View> : null}
      <DataTable
        palette={palette}
        caption="System activity log"
        columns={columns}
        rows={rows}
        rowKey={(activity) => activity._id}
        rowLabel={(activity) =>
          `${formatActivityTitle(activity.action)} by ${formatActivityActor(activity)}, ${whenLabel(activity.createdAt)}, ${activity.success === false ? "failed" : "succeeded"}`
        }
        onRowPress={onOpenActivity}
        rowHint="Opens the system logs for this person"
        stacked={compact}
        renderStacked={(activity) => (
          <>
            <View className="flex-row items-center gap-2">
              <View className="min-w-0 flex-1">
                <EventCell palette={palette} isDark={isDark} activity={activity} />
              </View>
              <ResultPill palette={palette} activity={activity} />
            </View>
            <Text className="text-[12.5px]" numberOfLines={1} style={{ color: palette.muted, paddingLeft: 42 }}>
              {formatActivityActor(activity)}
              {roleLabel(activity.role) ? `, ${roleLabel(activity.role)}` : ""} · {whenLabel(activity.createdAt)}
            </Text>
          </>
        )}
        emptyIcon="shield"
        emptyMessage={
          filter === "failed"
            ? "No failed events in the latest activity."
            : filter === "signins"
              ? "No sign-ins in the latest activity."
              : "No activity recorded yet."
        }
      />
    </PanelCard>
  );
};

export default ActivityLogTable;
