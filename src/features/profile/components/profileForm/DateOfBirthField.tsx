import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import DateOfBirthPicker from "@/features/auth/components/datePicker/DateOfBirthPicker";
import { formatBirthDate } from "@/features/auth/utils/dateOfBirth";
import { PROFILE_COLORS } from "../../config/profileTheme";
import FieldShell from "./FieldShell";

type DateOfBirthFieldProps = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
};

const DateOfBirthField = ({ label, value, onChange, error }: DateOfBirthFieldProps) => {
  const [open, setOpen] = useState(false);
  const display = value ? formatBirthDate(value) : "Select date of birth";

  return (
    <FieldShell label={label} error={error}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: display }}
        accessibilityHint="Opens a date picker"
        onPress={() => setOpen(true)}
        className={`flex-row items-center gap-2.5 rounded-2xl border bg-slate-50 px-3.5 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
        style={{ minHeight: 46 }}
      >
        <Feather name="calendar" size={16} color={PROFILE_COLORS.primary} />
        <Text
          numberOfLines={1}
          className={`flex-1 text-sm ${value ? "text-slate-800" : "text-slate-400"}`}
        >
          {display}
        </Text>
        <Feather name="chevron-down" size={16} color={PROFILE_COLORS.subtle} />
      </Pressable>

      <DateOfBirthPicker
        visible={open}
        value={value}
        onConfirm={onChange}
        onClose={() => setOpen(false)}
      />
    </FieldShell>
  );
};

export default DateOfBirthField;
