import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  QUEUE_RADIUS,
  STATUS_LABELS,
  type AppointmentStatus,
  type QueuePalette,
} from "../queueTheme";

export const AppointmentsError = ({
  error,
  onRetry,
  palette,
}: {
  error: string;
  onRetry: () => void;
  palette: QueuePalette;
}) => {
  return (
    <View className="items-center gap-2.5 px-6 py-12">
      <Feather name="alert-circle" size={22} color="#EF4444" />
      <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
        Unable to load appointments.
      </Text>
      <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
        {error}
      </Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        className="mt-1 h-10 justify-center px-5"
        style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: palette.primary }}
      >
        <Text className="text-[13.5px] font-semibold text-white">Try Again</Text>
      </Pressable>
    </View>
  );
};

export const AppointmentsSkeleton = ({ palette }: { palette: QueuePalette }) => {
  return (
    <View className="gap-3 px-5 py-5">
      {[0, 1, 2, 3].map((row) => (
        <View key={row} className="flex-row items-center gap-3">
          <View
            style={{ height: 36, width: 36, borderRadius: 999, backgroundColor: palette.skeleton }}
          />
          <View className="flex-1 gap-2">
            <View
              style={{ height: 12, width: "55%", borderRadius: 6, backgroundColor: palette.skeleton }}
            />
            <View
              style={{ height: 10, width: "35%", borderRadius: 6, backgroundColor: palette.skeleton }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

export const AppointmentsEmpty = ({
  activeStatus,
  message,
  palette,
}: {
  activeStatus: AppointmentStatus;
  message: string;
  palette: QueuePalette;
}) => {
  return (
    <View className="items-center gap-1.5 px-6 py-14">
      <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
        No {STATUS_LABELS[activeStatus].toLowerCase()} appointments.
      </Text>
      <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
        {message}
      </Text>
    </View>
  );
};
