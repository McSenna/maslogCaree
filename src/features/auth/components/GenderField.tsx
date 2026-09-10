import { Pressable, Text, View } from "react-native";
import { GENDER_OPTIONS } from "../constants/registrationFields";
import FieldError from "./FieldError";
import FieldLabel from "./FieldLabel";

type GenderFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

/** A three-way segmented control — the whole option set fits on one row. */
export default function GenderField({ value, onChange, error }: GenderFieldProps) {
  return (
    <View>
      <FieldLabel>Gender *</FieldLabel>
      <View
        className="flex-row rounded-xl border border-slate-200 bg-slate-100/70 p-1"
        style={{ height: 44 }}
      >
        {GENDER_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              className="flex-1 items-center justify-center rounded-[9px]"
              style={{
                backgroundColor: isSelected ? "#fff" : "transparent",
                boxShadow: isSelected
                  ? "0px 1px 4px rgba(0,0,0,0.08)"
                  : "0px 0px 0px rgba(0,0,0,0)",
                elevation: isSelected ? 2 : 0,
              }}
            >
              <Text
                className="text-[12px]"
                style={{
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? "#3B5BDB" : "#94A3B8",
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FieldError message={error} />
    </View>
  );
}
