import { Pressable, Text, View } from "react-native";

import { REG_COLORS } from "../../registration/registrationTheme";

type DatePickerActionsProps = {
  onCancel: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
  height: number;
};

const DatePickerActions = ({
  onCancel,
  onConfirm,
  canConfirm,
  height,
}: DatePickerActionsProps) => (
  <View style={{ flexDirection: "row", gap: 12 }}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Cancel date selection"
      onPress={onCancel}
      style={{
        flex: 1,
        height,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: REG_COLORS.border,
        backgroundColor: REG_COLORS.surface,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "600", color: REG_COLORS.text }}>Cancel</Text>
    </Pressable>

    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Confirm date of birth"
      accessibilityState={{ disabled: !canConfirm }}
      onPress={onConfirm}
      disabled={!canConfirm}
      style={{
        flex: 1,
        height,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: REG_COLORS.primary,
        opacity: canConfirm ? 1 : 0.5,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "700", color: "#FFFFFF" }}>Confirm</Text>
    </Pressable>
  </View>
);

export default DatePickerActions;
