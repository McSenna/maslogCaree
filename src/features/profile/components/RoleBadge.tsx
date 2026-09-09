import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { PROFILE_RADIUS } from "../config/profileTheme";
import type { RoleBadgeStyle } from "../config/profileRoleConfig";

type RoleBadgeProps = {
  label: string;
  style: RoleBadgeStyle;
  compact?: boolean;
};

/**
 * Compact role pill — the colour comes from the role config, never from a
 * branch at the call site.
 */
const RoleBadge = ({ label, style, compact = false }: RoleBadgeProps) => (
  <View
    accessibilityRole="text"
    accessibilityLabel={`Role: ${label}`}
    style={{
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 5,
      paddingHorizontal: compact ? 9 : 11,
      paddingVertical: compact ? 4 : 5,
      borderRadius: PROFILE_RADIUS.pill,
      backgroundColor: style.background,
      borderWidth: 1,
      borderColor: style.border,
    }}
  >
    <Feather name="user" size={compact ? 11 : 12.5} color={style.text} />
    <Text
      numberOfLines={1}
      maxFontSizeMultiplier={1.2}
      style={{
        fontSize: compact ? 12 : 13,
        fontWeight: "700",
        color: style.text,
      }}
    >
      {label}
    </Text>
  </View>
);

export default RoleBadge;
