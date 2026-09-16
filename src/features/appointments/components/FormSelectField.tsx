import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { APPOINTMENT_COLORS } from "./appointmentTheme";
import FieldLabel from "./FieldLabel";
import SelectOptionSheet from "./selectField/SelectOptionSheet";
import SelectTrigger from "./selectField/SelectTrigger";
import type { FormSelectFieldProps } from "./selectField/selectFieldTypes";

export type { SelectOption } from "./selectField/selectFieldTypes";

const FormSelectField = ({
  label,
  required = false,
  placeholder,
  sheetTitle,
  icon,
  options,
  value,
  onChange,
  error = null,
  disabled = false,
  loading = false,
  loadingText = "Loading…",
  emptyText = "No options are available right now.",
  helperText = null,
}: FormSelectFieldProps) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.id === value) ?? null;
  const isDisabled = disabled || loading;
  const hasError = Boolean(error);

  return (
    <View className="w-full">
      <FieldLabel label={label} required={required} />

      <SelectTrigger
        label={label}
        placeholder={placeholder}
        icon={icon}
        selected={selected}
        open={open}
        hasError={hasError}
        isDisabled={isDisabled}
        loading={loading}
        loadingText={loadingText}
        onPress={() => setOpen(true)}
      />

      {hasError ? (
        <View className="mt-1.5 flex-row items-center gap-1.5">
          <Feather name="alert-circle" size={13} color={APPOINTMENT_COLORS.danger} />
          <Text
            accessibilityRole="alert"
            className="flex-1"
            style={{ fontSize: 12.5, color: APPOINTMENT_COLORS.danger }}
          >
            {error}
          </Text>
        </View>
      ) : helperText ? (
        <Text className="mt-1.5" style={{ fontSize: 12.5, color: APPOINTMENT_COLORS.mutedText }}>
          {helperText}
        </Text>
      ) : null}

      <SelectOptionSheet
        open={open}
        label={label}
        sheetTitle={sheetTitle}
        options={options}
        value={value}
        emptyText={emptyText}
        onSelect={(id) => {
          onChange(id);
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </View>
  );
};

export default FormSelectField;
