import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { REG_COLORS } from "../registrationTheme";

type AvatarPickerProps = {
  photo: string | null;
  onPress: () => void;
};

const AvatarPicker = ({ photo, onPress }: AvatarPickerProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={photo ? "Change your profile photo" : "Add a profile photo"}
    style={{ flexDirection: "row", alignItems: "center", gap: 14, minHeight: 44 }}
  >
    {photo ? (
      <Image
        source={{ uri: photo }}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          borderWidth: 2,
          borderColor: REG_COLORS.primary,
        }}
      />
    ) : (
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: REG_COLORS.borderStrong,
          backgroundColor: REG_COLORS.surfaceMuted,
        }}
      >
        <Feather name="camera" size={20} color={REG_COLORS.subtle} />
      </View>
    )}

    <View style={{ flex: 1, gap: 2 }}>
      <Text style={{ fontSize: 13.5, fontWeight: "600", color: REG_COLORS.primary }}>
        {photo ? "Change profile photo" : "Add a profile photo"}
      </Text>
      <Text style={{ fontSize: 12.5, color: REG_COLORS.muted }}>
        Optional — helps health workers recognise you at the centre.
      </Text>
    </View>
  </Pressable>
);

export default AvatarPicker;
