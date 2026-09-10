import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { APPOINTMENT_COLORS } from "./appointmentTheme";

type ConfirmationCheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  error?: string;
};

/** The resident's confirmation that the details are right, and its complaint. */
export default function ConfirmationCheckbox({
  checked,
  onToggle,
  error,
}: ConfirmationCheckboxProps) {
  return (
    <View>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel="I confirm that the appointment details provided are correct, required"
        onPress={onToggle}
        className="flex-row items-start"
        style={{ gap: 10, minHeight: 44, paddingVertical: 2 }}
      >
        <View
          className="items-center justify-center"
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            marginTop: 1,
            borderWidth: checked ? 0 : 1.5,
            borderColor: error ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.borderStrong,
            backgroundColor: checked ? APPOINTMENT_COLORS.primaryBright : APPOINTMENT_COLORS.white,
          }}
        >
          {checked ? <Feather name="check" size={15} color="#FFFFFF" /> : null}
        </View>

        <Text
          className="min-w-0 flex-1"
          style={{ fontSize: 13.5, lineHeight: 19, color: APPOINTMENT_COLORS.bodyText }}
        >
          I confirm that the appointment details provided are correct.
          <Text style={{ color: APPOINTMENT_COLORS.danger }}> *</Text>
        </Text>
      </Pressable>

      {error ? (
        <View className="mt-1.5 flex-row items-center" style={{ gap: 6 }}>
          <Feather name="alert-circle" size={13} color={APPOINTMENT_COLORS.danger} />
          <Text
            accessibilityRole="alert"
            style={{ fontSize: 12.5, color: APPOINTMENT_COLORS.danger }}
          >
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
