import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { SOCIAL_COLORS } from "../../config/profileSocialTheme";

type EditProfileHeaderProps = {
  onClose: () => void;
  compact?: boolean;
};

const EditProfileHeader = ({ onClose, compact = false }: EditProfileHeaderProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: compact ? 18 : 24,
      paddingTop: compact ? 6 : 20,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: SOCIAL_COLORS.divider,
    }}
  >
    <Text
      accessibilityRole="header"
      numberOfLines={1}
      style={{
        flex: 1,
        fontSize: compact ? 18 : 21,
        fontWeight: "800",
        letterSpacing: -0.4,
        color: SOCIAL_COLORS.navy,
      }}
    >
      Edit Profile
    </Text>

    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close edit profile"
      onPress={onClose}
      hitSlop={10}
      className="items-center justify-center active:opacity-70"
      style={{ width: 36, height: 36, borderRadius: 18 }}
    >
      <Feather name="x" size={20} color={SOCIAL_COLORS.muted} />
    </Pressable>
  </View>
);

export default EditProfileHeader;
