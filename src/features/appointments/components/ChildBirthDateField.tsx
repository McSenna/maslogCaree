import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import DateOfBirthPicker from "@/features/auth/components/datePicker/DateOfBirthPicker";
import { formatBirthDate } from "@/features/auth/utils/dateOfBirth";
import { TYPE } from "@/theme/typography";
import { webStyle } from "@/theme/webStyle";

import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import FieldErrorText from "./FieldErrorText";
import FieldLabel from "./FieldLabel";

type ChildBirthDateFieldProps = {
  value: string;
  onChange: (isoDate: string) => void;
  error?: string | null;
};

/** Opens the same birth-date calendar as registration; it never offers a future day. */
const ChildBirthDateField = ({ value, onChange, error = null }: ChildBirthDateFieldProps) => {
  const [open, setOpen] = useState(false);
  const hasError = Boolean(error);
  const accent = hasError ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.primaryBright;

  return (
    <View className="w-full">
      <FieldLabel label="Child's Date of Birth" required />
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Child's date of birth, required"
        accessibilityValue={{ text: value ? formatBirthDate(value) : "Not set" }}
        accessibilityHint="Opens a calendar"
        className="flex-row items-center px-3 active:opacity-80"
        style={{
          minHeight: APPOINTMENT_METRICS.fieldHeight,
          gap: 9,
          borderRadius: APPOINTMENT_METRICS.radiusField,
          borderWidth: hasError || open ? 1.5 : 1,
          borderColor: hasError || open ? accent : APPOINTMENT_COLORS.border,
          backgroundColor: APPOINTMENT_COLORS.white,
          ...webStyle({ cursor: "pointer" }),
        }}
      >
        <Feather name="calendar" size={18} color={accent} />
        <Text
          className="min-w-0 flex-1"
          style={[TYPE.body, { color: value ? APPOINTMENT_COLORS.bodyText : APPOINTMENT_COLORS.placeholder }]}
        >
          {value ? formatBirthDate(value) : "Select the child's date of birth"}
        </Text>
        <Feather name="chevron-down" size={18} color={APPOINTMENT_COLORS.mutedText} />
      </Pressable>
      <FieldErrorText message={error} />

      {/* A child's birthday is recent, so the calendar opens on this month, not the adult default year. */}
      <DateOfBirthPicker
        visible={open}
        value={value}
        onConfirm={onChange}
        onClose={() => setOpen(false)}
        opensAt={{ year: new Date().getFullYear(), monthIndex: new Date().getMonth() }}
      />
    </View>
  );
};

export default ChildBirthDateField;
