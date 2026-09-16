import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import type { ActivityTone, ProfileActivityItem } from "../../types/profile.types";

type ActivityRowProps = {
  item: ProfileActivityItem;
  showDivider: boolean;
};

const TONE_COLORS: Record<ActivityTone, { bg: string; fg: string }> = {
  info: { bg: SOCIAL_COLORS.primarySoft, fg: SOCIAL_COLORS.primary },
  success: { bg: SOCIAL_COLORS.greenSoft, fg: SOCIAL_COLORS.greenDeep },
  warning: { bg: SOCIAL_COLORS.pendingBg, fg: SOCIAL_COLORS.pendingText },
};

const ActivityRow = ({ item, showDivider }: ActivityRowProps) => {
  const tone = TONE_COLORS[item.tone];

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
        borderBottomColor: SOCIAL_COLORS.divider,
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
          style={{ fontSize: 14, fontWeight: "700", color: SOCIAL_COLORS.heading }}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: 13, lineHeight: 18, color: SOCIAL_COLORS.muted }}
        >
          {item.detail}
        </Text>
      </View>

      {item.time ? (
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: 11.5, color: SOCIAL_COLORS.subtle }}
        >
          {item.time}
        </Text>
      ) : null}
    </View>
  );
};

export default ActivityRow;
