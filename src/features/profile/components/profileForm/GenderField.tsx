import { View } from "react-native";
import OptionRow from "@/components/forms/OptionRow";
import { SPACING } from "@/theme/spacing";
import { GENDER_OPTIONS } from "../../config/profileEditSections";
import FieldShell from "./FieldShell";

type GenderFieldProps = {
  label: string;
  value: string;
  onChange: (gender: string) => void;
  error?: string;
};

const GenderField = ({ label, value, onChange, error }: GenderFieldProps) => (
  <FieldShell label={label} error={error}>
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ flexDirection: "row", gap: SPACING.sm }}>
      {GENDER_OPTIONS.map((option) => (
        <View key={option.value} style={{ flex: 1, minWidth: 0 }}>
          <OptionRow
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
          />
        </View>
      ))}
    </View>
  </FieldShell>
);

export default GenderField;
