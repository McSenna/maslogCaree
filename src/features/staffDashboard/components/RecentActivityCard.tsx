import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import EmptyPanelState from "@/components/dashboard/admin/EmptyPanelState";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffActivity } from "@/services/staffDashboardService";
import ServiceBadge from "./ServiceBadge";

const completedLabel = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  return sameDay
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const RecentActivityCard = ({
  palette,
  activities,
  title,
  subtitle,
  showService,
  limit = 5,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  activities: StaffActivity[];
  title: string;
  subtitle: string;
  showService: boolean;
  limit?: number;
  fill?: boolean;
}) => {
  const visible = activities.slice(0, limit);

  return (
    <PanelCard palette={palette} title={title} icon="file-text" subtitle={subtitle} fill={fill}>
      {visible.length === 0 ? (
        <EmptyPanelState
          palette={palette}
          icon="file-text"
          message="Nothing has been completed yet."
        />
      ) : (
        <View className="w-full gap-3">
          {visible.map((activity) => {
            const readings = activity.highlights
              .map((h) => `${h.value}${h.unit ? ` ${h.unit}` : ""}`)
              .join(" · ");

            return (
              <View
                key={activity._id}
                className="w-full gap-1.5"
                accessibilityRole="text"
                accessibilityLabel={
                  activity.highlights.length
                    ? `${activity.patientName}, ${activity.highlights.map((h) => `${h.label} ${h.value} ${h.unit}`).join(", ")}, ${completedLabel(activity.completedAt)}`
                    : `${activity.patientName}, ${activity.serviceLabel}, ${completedLabel(activity.completedAt)}`
                }
              >
                <View className="flex-row items-center gap-3">
                  <Text
                    className="min-w-0 flex-1 text-[13.5px] font-semibold"
                    numberOfLines={1}
                    style={{ color: palette.heading }}
                  >
                    {activity.patientName}
                  </Text>
                  <Text
                    className="text-[12px] font-medium tabular-nums"
                    style={{ color: palette.subtle }}
                  >
                    {completedLabel(activity.completedAt)}
                  </Text>
                </View>

                <View className="flex-row flex-wrap items-center gap-2">
                  {showService ? (
                    <ServiceBadge
                      serviceKey={activity.serviceType}
                      label={activity.serviceLabel}
                      compact
                    />
                  ) : null}

                  {readings ? (
                    <Text
                      className="text-[12.5px] font-semibold tabular-nums"
                      style={{ color: palette.body }}
                    >
                      {readings}
                    </Text>
                  ) : null}

                  {activity.itemsGivenCount > 0 ? (
                    <Text className="text-[12px] font-medium" style={{ color: palette.muted }}>
                      {activity.itemsGivenCount} {activity.itemsGivenCount === 1 ? "item" : "items"} given
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </PanelCard>
  );
};

export default RecentActivityCard;
