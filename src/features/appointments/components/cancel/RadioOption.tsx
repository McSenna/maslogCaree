import { Pressable, Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

type Props = {
  palette: ResidentDialogPalette;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const RadioOption = ({ palette, label, selected, disabled = false, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="radio"
    accessibilityState={{ selected, disabled }}
    accessibilityLabel={label}
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      minHeight: 44,
      padding: 12,
      borderRadius: 10,
      backgroundColor: selected ? palette.dangerSoft : palette.card,
      borderColor: selected ? palette.danger : palette.border,
      borderWidth: 1,
      opacity: disabled ? 0.6 : 1,
    }}
  >
    <View
      style={{
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: selected ? palette.danger : palette.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {selected ? (
        <View
          style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: palette.danger }}
        />
      ) : null}
    </View>

    <Text
      style={{
        fontSize: 13.5,
        fontWeight: selected ? "600" : "500",
        color: selected ? palette.dangerFg : palette.body,
      }}
    >
      {label}
    </Text>
  </Pressable>
);

export default RadioOption;
