import type { ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

import SelectMenu, { type SelectOption } from "@/components/ui/SelectMenu";

import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "./inventoryTheme";

type FieldProps = {
  label: string;
  required?: boolean;
  helper?: string | null;
  error?: string | null;
  children: ReactNode;
};

export const Field = ({ label, required = false, helper, error, children }: FieldProps) => {
  const palette = useInventoryPalette();

  return (
    <View className="w-full gap-1.5">
      <Text className="text-[12.5px] font-semibold" style={{ color: palette.heading }}>
        {label}
        {required ? <Text style={{ color: palette.danger }}> *</Text> : null}
      </Text>
      {children}
      {error ? (
        <Text className="text-[11.5px] font-medium" style={{ color: palette.danger }}>
          {error}
        </Text>
      ) : helper ? (
        <Text className="text-[11.5px]" style={{ color: palette.subtle }}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
};

type TextFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  keyboardType?: "default" | "number-pad";
  multiline?: boolean;
  editable?: boolean;
  maxLength?: number;
};

export const TextField = ({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  keyboardType = "default",
  multiline = false,
  editable = true,
  maxLength,
}: TextFieldProps) => {
  const palette = useInventoryPalette();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={palette.subtle}
      accessibilityLabel={accessibilityLabel}
      keyboardType={keyboardType}
      multiline={multiline}
      editable={editable}
      maxLength={maxLength}
      className="w-full border px-3.5 text-[14px]"
      style={
        {
          minHeight: multiline ? 84 : CONTROL_HEIGHT,
          paddingTop: multiline ? 12 : 0,
          paddingBottom: multiline ? 12 : 0,
          textAlignVertical: multiline ? "top" : "center",
          borderRadius: RADIUS.control,
          backgroundColor: editable ? palette.cardBg : palette.subtleSurface,
          borderColor: palette.cardBorder,
          color: editable ? palette.body : palette.muted,
          outlineStyle: "none",
        } as never
      }
    />
  );
};

export const ReadOnlyValue = ({ value }: { value: string }) => {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full justify-center border px-3.5"
      style={{
        height: CONTROL_HEIGHT,
        borderRadius: RADIUS.control,
        backgroundColor: palette.subtleSurface,
        borderColor: palette.cardBorder,
      }}
    >
      <Text className="text-[14px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
        {value}
      </Text>
    </View>
  );
};

export const SelectField = <T extends string,>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}) => {
  return (
    <SelectMenu
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      height={CONTROL_HEIGHT}
      style={{ width: "100%" }}
    />
  );
};
