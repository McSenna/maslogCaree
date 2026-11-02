import { Switch, Text, View } from "react-native";
import useImmunizationStyles from "./immunizationStyles";
const ClinicalToggle = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => {
  const { styles, colors } = useImmunizationStyles();
  return (
    <View style={styles.row}>
      <Switch
        accessibilityLabel={label}
        trackColor={{ false: colors.borderStrong, true: colors.primary }}
        thumbColor={colors.surface}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      />
      <Text style={styles.body}>{label}</Text>
    </View>
  );
};
export default ClinicalToggle;
