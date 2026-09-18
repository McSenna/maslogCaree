import { Pressable, Text, View } from "react-native";
import { GENDER_OPTIONS } from "../../config/profileEditSections";
import { PROFILE_COLORS } from "../../config/profileTheme";
import FieldShell from "./FieldShell";

type GenderFieldProps = {
  label: string;
  value: string;
  onChange: (gender: string) => void;
  error?: string;
};

const GenderField = ({ label, value, onChange, error }: GenderFieldProps) => (
  <FieldShell label={label} error={error}>
    <View className="flex-row gap-2">
      {GENDER_OPTIONS.map((option) => {
        const selected = value === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className="flex-1 items-center justify-center rounded-2xl border active:opacity-80"
            style={{
              minHeight: 46,
              borderColor: selected ? PROFILE_COLORS.primary : PROFILE_COLORS.border,
              backgroundColor: selected ? PROFILE_COLORS.primarySoft : "#F8FAFC",
            }}
          >
            <Text
              className="text-sm"
              style={{
                fontWeight: selected ? "700" : "500",
                color: selected ? PROFILE_COLORS.primary : PROFILE_COLORS.body,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </FieldShell>
);

export default GenderField;
