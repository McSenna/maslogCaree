import { Pressable, ScrollView, Text } from "react-native";

import { BIRTH_YEARS } from "../../constants/registrationFields";
import { REG_COLORS } from "../../registration/registrationTheme";

type YearPickerProps = {
  year: number;
  onSelect: (year: number) => void;
  height: number;
};

const YearPicker = ({ year, onSelect, height }: YearPickerProps) => (
  <ScrollView
    style={{ height }}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingVertical: 4 }}
  >
    {BIRTH_YEARS.map((option) => {
      const isSelected = option === year;

      return (
        <Pressable
          key={option}
          accessibilityRole="button"
          accessibilityLabel={`Year ${option}`}
          accessibilityState={{ selected: isSelected }}
          onPress={() => onSelect(option)}
          style={{
            width: "31.5%",
            paddingVertical: 9,
            alignItems: "center",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isSelected ? REG_COLORS.primary : REG_COLORS.border,
            backgroundColor: isSelected ? REG_COLORS.primarySoft : REG_COLORS.surface,
          }}
        >
          <Text
            style={{
              fontSize: 13.5,
              fontWeight: isSelected ? "800" : "500",
              color: isSelected ? REG_COLORS.primary : REG_COLORS.text,
            }}
          >
            {option}
          </Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

export default YearPicker;
