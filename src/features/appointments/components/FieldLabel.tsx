import { Text, View } from "react-native";
import { APPOINTMENT_COLORS } from "./appointmentTheme";

const FieldLabel = ({
  label,
  required = false,
  optional = false,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
}) => {
  return (
    <View className="mb-1.5 flex-row items-center">
      <Text
        accessibilityLabel={required ? `${label}, required` : label}
        style={{ fontSize: 14, fontWeight: "700", color: APPOINTMENT_COLORS.primary }}
      >
        {label}
      </Text>
      {required ? (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ fontSize: 14, fontWeight: "700", color: APPOINTMENT_COLORS.danger }}
        >
          {" *"}
        </Text>
      ) : null}
      {optional ? (
        <Text style={{ fontSize: 13, fontWeight: "500", color: APPOINTMENT_COLORS.mutedText }}>
          {" (optional)"}
        </Text>
      ) : null}
    </View>
  );
};

export default FieldLabel;
