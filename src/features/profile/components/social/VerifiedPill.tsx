import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../../config/profileTheme";

type VerifiedPillProps = {
  verified: boolean;
  roleLabel: string;
};

const VerifiedPill = ({ verified, roleLabel }: VerifiedPillProps) => {
  const label = verified ? `Verified ${roleLabel}` : "Verification pending";

  const palette = verified
    ? {
        bg: SOCIAL_COLORS.verifiedBg,
        text: SOCIAL_COLORS.verifiedText,
        border: SOCIAL_COLORS.verifiedBorder,
        icon: "check-circle" as const,
      }
    : {
        bg: SOCIAL_COLORS.pendingBg,
        text: SOCIAL_COLORS.pendingText,
        border: SOCIAL_COLORS.pendingBorder,
        icon: "clock" as const,
      };

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: PROFILE_RADIUS.pill,
        backgroundColor: palette.bg,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Feather name={palette.icon} size={12} color={palette.text} />
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={{ fontSize: 12, fontWeight: "700", color: palette.text }}
      >
        {label}
      </Text>
    </View>
  );
};

export default VerifiedPill;
