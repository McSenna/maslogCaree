import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "../../config/profileTheme";

export const SectionEditLink = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    className="flex-row items-center active:opacity-75"
    style={{
      gap: 4,
      minHeight: 32,
      paddingHorizontal: 12,
      borderRadius: PROFILE_RADIUS.pill,
      backgroundColor: PROFILE_COLORS.primarySoft,
    }}
  >
    <Feather name="edit-2" size={12} color={PROFILE_COLORS.primary} />
    <Text style={{ fontSize: 13, fontWeight: "700", color: PROFILE_COLORS.primary }}>Edit</Text>
  </Pressable>
);

export const SectionEditingBadge = () => (
  <View
    accessibilityRole="text"
    accessibilityLabel="Currently editing this section"
    className="flex-row items-center"
    style={{
      gap: 5,
      minHeight: 28,
      paddingHorizontal: 10,
      borderRadius: PROFILE_RADIUS.pill,
      borderWidth: 1,
      borderColor: PROFILE_COLORS.primaryBorder,
      backgroundColor: PROFILE_COLORS.primarySoft,
    }}
  >
    <View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: PROFILE_COLORS.primary,
      }}
    />
    <Text style={{ fontSize: 12, fontWeight: "700", color: PROFILE_COLORS.primary }}>
      Editing
    </Text>
  </View>
);
