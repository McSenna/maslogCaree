import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";
import { PROFILE_RADIUS } from "../../config/profileTheme";
import type { ProfileIconName } from "../../types/profile.types";

type ProfileActionButtonProps = {
  label: string;
  icon: ProfileIconName;
  onPress?: () => void;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

const ProfileActionButton = ({
  label,
  icon,
  onPress,
  variant = "secondary",
  fullWidth = false,
}: ProfileActionButtonProps) => {
  const isPrimary = variant === "primary";
  const foreground = isPrimary ? "#FFFFFF" : SOCIAL_COLORS.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-center active:opacity-85"
      style={{
        gap: 8,
        flex: fullWidth ? 1 : undefined,
        minHeight: 44,
        paddingHorizontal: 18,
        borderRadius: PROFILE_RADIUS.control,
        borderWidth: isPrimary ? 0 : 1.5,
        borderColor: SOCIAL_COLORS.primaryBorder,
        backgroundColor: isPrimary ? SOCIAL_COLORS.primary : SOCIAL_COLORS.surface,
        opacity: onPress ? 1 : 0.55,
      }}
    >
      <Feather name={icon} size={15} color={foreground} />
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={{ fontSize: 14, fontWeight: "700", color: foreground }}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default ProfileActionButton;
