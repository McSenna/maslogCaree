import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { REG_COLORS } from "../../registrationTheme";
import { PALETTE } from "@/theme/palette";

type Props = {
  onReplace: () => void;
  onRemove: () => void;
};

const IdPreviewActions = ({ onReplace, onRemove }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: PALETTE.slate[200],
        backgroundColor: PALETTE.white,
      }}
    >
      <Pressable
        onPress={onReplace}
        accessibilityRole="button"
        accessibilityLabel="Replace document"
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Feather name="refresh-cw" size={13} color={REG_COLORS.primary} />
        <Text style={{ fontSize: 12.5, fontWeight: "600", color: REG_COLORS.primary }}>
          Replace Document
        </Text>
      </Pressable>

      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel="Remove document"
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <Feather name="trash-2" size={13} color={PALETTE.red[600]} />
        <Text style={{ fontSize: 12.5, fontWeight: "600", color: PALETTE.red[700] }}>Remove</Text>
      </Pressable>
    </View>
  );
};

export default IdPreviewActions;
