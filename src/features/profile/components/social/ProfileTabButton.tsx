import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import type { ProfileTabDefinition } from "../../config/profileTabs";

type ProfileTabButtonProps = {
  tab: ProfileTabDefinition;
  active: boolean;
  compact: boolean;
  onPress: () => void;
};

const ProfileTabButton = ({ tab, active, compact, onPress }: ProfileTabButtonProps) => {
  const color = active ? SOCIAL_COLORS.tabActive : SOCIAL_COLORS.tabInactive;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      className="items-center justify-center active:opacity-70"
      style={{ flex: 1, minHeight: 48, paddingHorizontal: 4 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingBottom: 8 }}>
        {compact ? null : <Feather name={tab.icon} size={15} color={color} />}
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
          style={{ fontSize: compact ? 13 : 14, fontWeight: active ? "700" : "600", color }}
        >
          {compact ? tab.shortLabel : tab.label}
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 0,
          height: 2.5,
          borderRadius: 2,
          backgroundColor: active ? SOCIAL_COLORS.tabIndicator : "transparent",
        }}
      />
    </Pressable>
  );
};

export default ProfileTabButton;
