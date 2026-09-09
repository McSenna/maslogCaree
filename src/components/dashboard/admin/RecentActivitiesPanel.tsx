import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import {
  formatActivityActor,
  formatActivityTitle,
  type DashboardActivity,
} from "@/services/adminDashboardService";
import { formatDateTime } from "@/utils/dateFormatter";
import EmptyPanelState from "./EmptyPanelState";
import PanelCard from "./PanelCard";

type RecentActivitiesPanelProps = {
  palette: AdminDashboardPalette;
  activities: DashboardActivity[];
  compact: boolean;
  onViewAll: () => void;
  fill?: boolean;
};

type ActivityVisual = { icon: keyof typeof Feather.glyphMap; color: string; tint: string };

/** Icon + tint per logged action, matching the tone used elsewhere for that event. */
function activityVisual(action: string): ActivityVisual {
  switch (action) {
    case "LOGIN":
      return { icon: "log-in", color: "#22C55E", tint: "#E3FBEC" };
    case "LOGOUT":
      return { icon: "log-out", color: "#64748B", tint: "#EEF2F7" };
    case "LOGIN_FAILED":
      return { icon: "alert-triangle", color: "#F43F5E", tint: "#FFE4E9" };
    // A platform block is policy working, not an incident: amber, not red.
    case "RESIDENT_WEB_LOGIN_BLOCKED":
    case "PLATFORM_ACCESS_DENIED":
      return { icon: "smartphone", color: "#F59E0B", tint: "#FEF3C7" };
    case "USER_CREATED":
      return { icon: "user-plus", color: "#1677FF", tint: "#E5F0FF" };
    case "USER_UPDATED":
      return { icon: "edit-2", color: "#1677FF", tint: "#E5F0FF" };
    case "USER_DELETED":
      return { icon: "user-x", color: "#F43F5E", tint: "#FFE4E9" };
    case "USER_ROLE_CHANGED":
      return { icon: "shuffle", color: "#8B5CF6", tint: "#F0EBFE" };
    case "USER_VERIFIED":
      return { icon: "user-check", color: "#22C55E", tint: "#E3FBEC" };
    case "USER_UNVERIFIED":
      return { icon: "user-minus", color: "#64748B", tint: "#EEF2F7" };
    case "RECORD_CREATED":
    case "RECORD_UPDATED":
    case "RECORD_VIEWED":
      return { icon: "file-text", color: "#1677FF", tint: "#E5F0FF" };
    case "SCHEDULE_CREATED":
    case "SCHEDULE_UPDATED":
    case "SCHEDULE_DELETED":
      return { icon: "calendar", color: "#F59E0B", tint: "#FDF1DC" };
    default:
      return { icon: "activity", color: "#8B5CF6", tint: "#F0EBFE" };
  }
}

export default function RecentActivitiesPanel({
  palette,
  activities,
  compact,
  onViewAll,
  fill = false,
}: RecentActivitiesPanelProps) {
  return (
    <PanelCard
      palette={palette}
      title="Recent Activities"
      onViewAll={onViewAll}
      fill={fill}
    >
      {activities.length === 0 ? (
        <EmptyPanelState palette={palette} icon="activity" message="No recent activities yet." />
      ) : (
        <View>
          {activities.map((activity, index) => {
            const visual = activityVisual(activity.action);
            const { date, time } = formatDateTime(activity.createdAt);

            return (
              <View key={activity._id}>
                {index > 0 ? (
                  <View className="h-px w-full" style={{ backgroundColor: palette.divider }} />
                ) : null}

                <View className="flex-row items-start gap-3 py-2.5">
                  <View
                    className="h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: visual.tint }}
                  >
                    <Feather name={visual.icon} size={16} color={visual.color} />
                  </View>

                  <View className="min-w-0 flex-1 gap-0.5">
                    <Text
                      className="text-[13.5px] font-semibold"
                      numberOfLines={1}
                      style={{ color: palette.heading }}
                    >
                      {formatActivityTitle(activity.action)}
                    </Text>

                    {compact ? (
                      <>
                        <Text
                          className="text-[12px]"
                          numberOfLines={1}
                          style={{ color: palette.muted }}
                        >
                          {formatActivityActor(activity)}
                        </Text>
                        <Text className="text-[11.5px]" style={{ color: palette.subtle }}>
                          {date} • {time}
                        </Text>
                      </>
                    ) : (
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="min-w-0 flex-1 text-[12px]"
                          numberOfLines={1}
                          style={{ color: palette.muted }}
                        >
                          {formatActivityActor(activity)}
                        </Text>
                        <Text className="text-[11.5px]" style={{ color: palette.subtle }}>
                          {date}
                        </Text>
                        <Text className="text-[11.5px]" style={{ color: palette.subtle }}>
                          {time}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </PanelCard>
  );
}
