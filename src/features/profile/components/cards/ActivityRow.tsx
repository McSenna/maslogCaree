import { useThemeColors } from "@/hooks/useThemeColors";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { ActivityTone, ProfileActivityItem } from "../../types/profile.types";

type ActivityRowProps = {
  item: ProfileActivityItem;
  showDivider: boolean;
};

const ActivityRow = ({ item, showDivider }: ActivityRowProps) => {
  const colors = useThemeColors();
  const tones: Record<ActivityTone, { bg: string; fg: string }> = {
    info: { bg: colors.primarySoft, fg: colors.primary },
    success: colors.success,
    warning: colors.warning,
  };
  const tone = tones[item.tone];

  return (
    <View
      accessible
      accessibilityLabel={`${item.title}. ${item.detail}`}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: colors.divider,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tone.bg,
        }}
      >
        <Feather name={item.icon} size={15} color={tone.fg} />
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: 14, fontWeight: "700", color: colors.heading }}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: 13, lineHeight: 18, color: colors.muted }}
        >
          {item.detail}
        </Text>
      </View>

      {item.time ? (
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: 11.5, color: colors.subtle }}
        >
          {item.time}
        </Text>
      ) : null}
    </View>
  );
};

export default ActivityRow;
