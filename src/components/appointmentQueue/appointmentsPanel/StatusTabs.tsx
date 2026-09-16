import { Pressable, ScrollView, Text, View } from "react-native";
import {
  QUEUE_RADIUS,
  STATUS_LABELS,
  STATUS_ORDER,
  type AppointmentStatus,
  type QueuePalette,
} from "../queueTheme";

type StatusTabsProps = {
  activeStatus: AppointmentStatus;
  onStatusChange: (status: AppointmentStatus) => void;
  statusCounts: Record<string, number>;
  palette: QueuePalette;
};

const StatusTabs = ({
  activeStatus,
  onStatusChange,
  statusCounts,
  palette,
}: StatusTabsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      {STATUS_ORDER.map((status) => {
        const isActive = status === activeStatus;
        const count = statusCounts[status] ?? 0;

        return (
          <Pressable
            key={status}
            onPress={() => onStatusChange(status)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${STATUS_LABELS[status]}, ${count}`}
            className="h-9 flex-row items-center gap-2 px-3.5"
            style={{
              borderRadius: QUEUE_RADIUS.pill,
              backgroundColor: isActive ? palette.primarySoft : "transparent",
            }}
          >
            <Text
              className={`text-[13.5px] ${isActive ? "font-semibold" : "font-medium"}`}
              style={{ color: isActive ? palette.primary : palette.muted }}
            >
              {STATUS_LABELS[status]}
            </Text>
            <View
              className="min-w-[22px] items-center px-1.5 py-0.5"
              style={{
                borderRadius: QUEUE_RADIUS.pill,
                backgroundColor: isActive ? palette.primary : palette.skeleton,
              }}
            >
              <Text
                className="text-[11px] font-bold"
                style={{ color: isActive ? "#FFFFFF" : palette.muted }}
              >
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default StatusTabs;
