import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "../appointmentTheme";
import type { SelectOption } from "./selectFieldTypes";

type Props = {
  option: SelectOption;
  isSelected: boolean;
  isLast: boolean;
  onSelect: (id: string) => void;
};

const SelectOptionRow = ({ option, isSelected, isLast, onSelect }: Props) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={option.label}
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelect(option.id)}
      className="w-full flex-row items-center justify-between px-5 active:opacity-70"
      style={{
        minHeight: APPOINTMENT_METRICS.optionMinHeight,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: isSelected
          ? APPOINTMENT_COLORS.surfaceTint
          : APPOINTMENT_COLORS.white,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: APPOINTMENT_COLORS.divider,
      }}
    >
      <View className="min-w-0 flex-1">
        <Text
          style={{
            fontSize: 15,
            fontWeight: isSelected ? "700" : "500",
            color: isSelected ? APPOINTMENT_COLORS.primary : APPOINTMENT_COLORS.bodyText,
          }}
        >
          {option.label}
        </Text>
        {option.helper ? (
          <Text
            className="mt-0.5"
            style={{ fontSize: 12.5, color: APPOINTMENT_COLORS.mutedText }}
          >
            {option.helper}
          </Text>
        ) : null}
      </View>

      {isSelected ? (
        <Feather name="check" size={18} color={APPOINTMENT_COLORS.primaryBright} />
      ) : null}
    </Pressable>
  );
};

export default SelectOptionRow;
