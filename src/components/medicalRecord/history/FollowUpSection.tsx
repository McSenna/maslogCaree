import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { QUEUE_RADIUS, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import { formatDate } from "@/utils/dateFormatter";
import type { FollowUp } from "./recordPresenter";

const FollowUpSection = ({
  followUp,
  palette,
}: {
  followUp: FollowUp | null;
  palette: QueuePalette;
}) => {
  if (!followUp) return null;

  const tint = palette.statuses.pending;
  const dateText = followUp.date ? formatDate(followUp.date) : "To be arranged with your health worker";

  return (
    <View className="w-full gap-2">
      <Text
        className="text-[11.5px] font-bold uppercase"
        style={{ color: palette.subtle, letterSpacing: 0.6 }}
      >
        Follow-Up
      </Text>

      <View
        className="w-full gap-3 px-3.5 py-3.5"
        style={{ borderRadius: QUEUE_RADIUS.control, backgroundColor: tint.bg }}
      >
        <View className="flex-row items-start gap-2.5">
          <Feather name="calendar" size={15} color={tint.dot} style={{ marginTop: 1 }} />
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-[11.5px] font-semibold" style={{ color: tint.fg, opacity: 0.85 }}>
              {followUp.dateLabel}
            </Text>
            <Text className="text-[14px] font-bold" style={{ color: tint.fg }}>
              {dateText}
            </Text>
          </View>
        </View>

        {followUp.instructions ? (
          <View className="gap-0.5">
            <Text className="text-[11.5px] font-semibold" style={{ color: tint.fg, opacity: 0.85 }}>
              Instruction
            </Text>
            <Text className="text-[13.5px] leading-[20px]" style={{ color: tint.fg }}>
              {followUp.instructions}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default FollowUpSection;
