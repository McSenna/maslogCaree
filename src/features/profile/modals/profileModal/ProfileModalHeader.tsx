import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { PROFILE_COLORS, PROFILE_TYPE } from "../../config/profileTheme";

const ProfileModalHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 16,
        paddingHorizontal: 28,
        paddingTop: 24,
        paddingBottom: 18,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={{
            fontSize: PROFILE_TYPE.modalTitle,
            fontWeight: "800",
            letterSpacing: -0.6,
            color: PROFILE_COLORS.navy,
          }}
        >
          {title}
        </Text>
        <Text style={{ marginTop: 4, fontSize: 14.5, color: PROFILE_COLORS.muted }}>
          View and manage your personal information.
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close profile"
        onPress={onClose}
        hitSlop={10}
        className="items-center justify-center active:opacity-70"
        style={{ width: 38, height: 38, borderRadius: 19 }}
      >
        <Feather name="x" size={21} color={PROFILE_COLORS.muted} />
      </Pressable>
    </View>
  );
};

export default ProfileModalHeader;
