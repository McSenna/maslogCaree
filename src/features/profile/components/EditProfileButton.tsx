import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "../config/profileTheme";

type EditProfileButtonProps = {
  onPress?: () => void;
  compact?: boolean;
};

/** Compact outlined "Edit Profile" control sitting in the hero (§14). */
const EditProfileButton = ({ onPress, compact = false }: EditProfileButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Edit profile"
    onPress={onPress}
    disabled={!onPress}
    className="flex-row items-center justify-center active:opacity-85"
    style={{
      gap: 7,
      // 44 on mobile, where the button spans the card and is the row's
      // only touch target; the web hero keeps it inline at 40.
      minHeight: compact ? 44 : 40,
      paddingHorizontal: compact ? 13 : 16,
      borderRadius: PROFILE_RADIUS.pill,
      borderWidth: 1.5,
      borderColor: PROFILE_COLORS.primaryBorder,
      backgroundColor: PROFILE_COLORS.surface,
      opacity: onPress ? 1 : 0.55,
    }}
  >
    <Feather name="edit-2" size={compact ? 14 : 14} color={PROFILE_COLORS.primary} />
    <Text
      numberOfLines={1}
      maxFontSizeMultiplier={1.2}
      style={{
        fontSize: compact ? 14 : 13.5,
        fontWeight: "700",
        color: PROFILE_COLORS.primary,
      }}
    >
      Edit Profile
    </Text>
  </Pressable>
);

export default EditProfileButton;
