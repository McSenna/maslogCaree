import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";
import {
  PROFILE_COLORS,
  PROFILE_RADIUS,
  PROFILE_SHADOW,
  PROFILE_TYPE,
} from "../config/profileTheme";

type ProfileSectionCardProps = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  /** Tint of the rounded icon chip beside the title. */
  tone?: "blue" | "green";
  /** Optional trailing control, e.g. the "Edit" link on Personal Information. */
  action?: ReactNode;
  children: ReactNode;
};

const TONES = {
  blue: { bg: PROFILE_COLORS.primarySoft, fg: PROFILE_COLORS.primary },
  green: { bg: PROFILE_COLORS.greenSoft, fg: PROFILE_COLORS.greenDeep },
} as const;

/**
 * The white card every profile section sits in — Personal Information, Account
 * Settings and Help & Support are all this component with different children.
 */
const ProfileSectionCard = ({
  title,
  icon,
  tone = "blue",
  action,
  children,
}: ProfileSectionCardProps) => {
  const palette = TONES[tone];

  return (
    <View
      style={{
        borderRadius: PROFILE_RADIUS.card,
        backgroundColor: PROFILE_COLORS.surface,
        borderWidth: 1,
        borderColor: PROFILE_COLORS.border,
        overflow: "hidden",
        ...PROFILE_SHADOW.card,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.bg,
          }}
        >
          <Feather name={icon} size={19} color={palette.fg} />
        </View>

        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
          accessibilityRole="header"
          style={{
            flex: 1,
            fontSize: PROFILE_TYPE.sectionTitle,
            fontWeight: "700",
            letterSpacing: -0.2,
            color: PROFILE_COLORS.navy,
          }}
        >
          {title}
        </Text>

        {action}
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>{children}</View>
    </View>
  );
};

export default ProfileSectionCard;
