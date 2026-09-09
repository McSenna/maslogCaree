import { Text, View } from "react-native";
import {
  QUEUE_RADIUS,
  STATUS_LABELS,
  useQueuePalette,
  type AppointmentStatus,
} from "./queueTheme";

/**
 * An appointment's standing, as a soft pill.
 *
 * The wording carries the meaning and the colour only reinforces it, so the
 * status is never communicated by hue alone.
 */
export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const palette = useQueuePalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${STATUS_LABELS[status] ?? status}`}
      className="flex-row items-center gap-1.5 self-start px-2.5 py-1"
      style={{ backgroundColor: tone.bg, borderRadius: QUEUE_RADIUS.pill }}
    >
      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.dot }} />
      <Text className="text-[12px] font-semibold" style={{ color: tone.fg }}>
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}
