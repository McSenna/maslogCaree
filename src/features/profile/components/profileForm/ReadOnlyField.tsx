import { Text } from "react-native";
import { PROFILE_COLORS } from "../../config/profileTheme";
import FieldShell from "./FieldShell";

type ReadOnlyFieldProps = {
  label: string;
  value: string;
  hint?: string;
};

const ReadOnlyField = ({ label, value, hint }: ReadOnlyFieldProps) => (
  <FieldShell label={label} hint={hint}>
    <Text
      accessibilityLabel={`${label}: ${value}`}
      style={{ fontSize: 14.5, fontWeight: "600", color: PROFILE_COLORS.heading }}
    >
      {value}
    </Text>
  </FieldShell>
);

export default ReadOnlyField;
