import { Text, View } from "react-native";
import { APPOINTMENT_COLORS } from "./appointmentTheme";

/**
 * "Service Type *" — the label above every control on the booking form.
 *
 * The asterisk is marked decorative and the requirement is carried in the
 * label text instead, so a screen reader announces "Service Type, required"
 * rather than "Service Type star".
 */
export default function FieldLabel({
  label,
  required = false,
  optional = false,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
}) {
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
}
