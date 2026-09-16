import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import DateOfBirthSheet from "../../components/DateOfBirthSheet";
import { formatBirthDate } from "../../utils/dateOfBirth";
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
  const [open, setOpen] = useState(false);

  return (
    <FieldShell label={label} required={required} error={error}>
      <Pressable
        onPress={() => setOpen(true)}
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

      <DateOfBirthSheet
        visible={open}
        value={value}
        onConfirm={onChange}
        onClose={() => setOpen(false)}
      />
    </FieldShell>
  );
};

export default DateInput;
