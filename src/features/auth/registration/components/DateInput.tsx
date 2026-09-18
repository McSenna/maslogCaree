import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import DateOfBirthPicker from "../../components/datePicker/DateOfBirthPicker";
import { formatBirthDate } from "../../utils/dateOfBirth";
import { useDatePickerHost } from "../dialog/datePickerHost";
import { REG_COLORS } from "../registrationTheme";
import FieldShell from "./FieldShell";
import { fieldSurface } from "./fieldStyles";

type DateInputProps = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
  height: number;
};

const DateInput = ({
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  height,
}: DateInputProps) => {
  const host = useDatePickerHost();
  const [localOpen, setLocalOpen] = useState(false);

  // The dialog hosts the picker when one is available, so its open state lives
  // outside the modal subtree that Android can remount. Standalone usage keeps
  // rendering its own picker.
  const open = host ? false : localOpen;
  const openPicker = () =>
    host ? host.open({ value, onConfirm: onChange }) : setLocalOpen(true);

  return (
    <FieldShell label={label} required={required} error={error}>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ? formatBirthDate(value) : placeholder }}
        accessibilityHint="Opens a date picker"
        style={{
          flexDirection: "row",
          alignItems: "center",
          height,
          paddingHorizontal: 14,
          gap: 10,
          ...fieldSurface({ focused: open, invalid: Boolean(error) }),
        }}
      >
        <Feather
          name="calendar"
          size={17}
          color={open ? REG_COLORS.primary : REG_COLORS.subtle}
        />
        <Text
          numberOfLines={1}
          style={{ flex: 1, fontSize: 15, color: value ? REG_COLORS.text : REG_COLORS.subtle }}
        >
          {value ? formatBirthDate(value) : placeholder}
        </Text>
        <Feather name="chevron-down" size={17} color={REG_COLORS.muted} />
      </Pressable>

      {host ? null : (
        <DateOfBirthPicker
          visible={open}
          value={value}
          onConfirm={onChange}
          onClose={() => setLocalOpen(false)}
        />
      )}
    </FieldShell>
  );
};

export default DateInput;
