import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { StatItem } from "@/types/residentDashboard";
import { CARD, CARD_SHADOW, RESIDENT_COLORS, TONES } from "./residentTheme";

type StatCardProps = {
  stat: StatItem;
  compact?: boolean;
};

const StatCard = ({ stat, compact = false }: StatCardProps) => {
  const tone = TONES[stat.tone];

  const surface = {
    borderRadius: CARD.radius,
    backgroundColor: RESIDENT_COLORS.cardBg,
    borderColor: RESIDENT_COLORS.border,
    ...CARD_SHADOW,
  };

  const accessibilityLabel = `${stat.label}, ${stat.value}, ${stat.caption}`;

  if (compact) {
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        className="min-w-0 flex-1 border p-3"
        style={surface}
      >
        <View
          className="h-9 w-9 items-center justify-center"
          style={{ backgroundColor: tone.bg, borderRadius: CARD.radiusSm }}
        >
          <Ionicons name={stat.icon} size={18} color={tone.fg} />
        </View>
        <Text
          className="mt-2 text-[12px] font-semibold"
          numberOfLines={1}
          style={{ color: RESIDENT_COLORS.muted }}
        >
          {stat.shortLabel}
        </Text>
        <Text
          className="text-[22px] font-extrabold"
          style={{ color: RESIDENT_COLORS.heading, lineHeight: 28 }}
        >
          {stat.value}
        </Text>
      </View>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="min-w-0 flex-1 flex-row items-center gap-3 border p-3.5"
      style={surface}
    >
      <View
        className="h-12 w-12 shrink-0 items-center justify-center"
        style={{ backgroundColor: tone.bg, borderRadius: CARD.radiusSm }}
      >
        <Ionicons name={stat.icon} size={24} color={tone.fg} />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-[12.5px] font-medium"
          numberOfLines={1}
          style={{ color: RESIDENT_COLORS.muted }}
        >
          {stat.label}
        </Text>
        <Text
          className="text-[26px] font-extrabold"
          style={{ color: RESIDENT_COLORS.heading, lineHeight: 32 }}
        >
          {stat.value}
        </Text>
        <Text className="text-[12px]" numberOfLines={1} style={{ color: RESIDENT_COLORS.subtle }}>
          {stat.caption}
        </Text>
      </View>
    </View>
  );
};

export default StatCard;
