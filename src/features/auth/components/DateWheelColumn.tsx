import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type DateWheelColumnProps<T extends string | number> = {
  label: string;
  options: readonly T[];
  selected: T;
  onSelect: (option: T, index: number) => void;
  flex: number;
  renderLabel?: (option: T, index: number) => string;
  itemClassName?: string;
};

const DateWheelColumn = <T extends string | number,>({
  label,
  options,
  selected,
  onSelect,
  flex,
  renderLabel,
  itemClassName = "py-2 rounded-lg mb-0.5",
}: DateWheelColumnProps<T>) => {
  return (
    <View style={{ flex }}>
      <Text className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center mb-1.5">
        {label}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {options.map((option, index) => {
          const isSelected = option === selected;
          return (
            <TouchableOpacity
              key={String(option)}
              onPress={() => onSelect(option, index)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              className={itemClassName}
              style={{ backgroundColor: isSelected ? "#EEF2FF" : "transparent" }}
            >
              <Text
                className="text-center text-[12.5px]"
                style={{
                  fontWeight: isSelected ? "700" : "400",
                  color: isSelected ? "#3B5BDB" : "#475569",
                }}
              >
                {renderLabel ? renderLabel(option, index) : option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DateWheelColumn;
