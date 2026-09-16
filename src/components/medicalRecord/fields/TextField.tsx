import { Text, TextInput, View } from "react-native";

import { FieldHelper, FieldLabel, buildShellStyle, type FieldPartProps } from "./fieldShell";

const TextField = ({
  field,
  value,
  onChange,
  palette,
  helper,
  error,
  disabled,
}: FieldPartProps) => {
  const shellStyle = buildShellStyle(palette, error, disabled);
  const boxStyle = { ...shellStyle, color: palette.heading } as const;

  const isMultiline = field.type === "textarea";
  const isNumber = field.type === "number";

  const handleText = (text: string) => {
    if (!isNumber) {
      onChange(text);
      return;
    }
    onChange(text.replace(/[^0-9.\-]/g, ""));
  };

  const shared = {
    value: value === null || value === undefined ? "" : String(value),
    onChangeText: handleText,
    editable: !disabled,
    maxLength: field.maxLength,
    placeholderTextColor: palette.subtle,
    keyboardType: isNumber ? ("decimal-pad" as const) : ("default" as const),
    accessibilityLabel: field.unit ? `${field.label} in ${field.unit}` : field.label,
  };

  if (isNumber && field.unit) {
    return (
      <View className="w-full">
        <FieldLabel field={field} palette={palette} />
        <View className="h-11 flex-row items-center overflow-hidden" style={shellStyle}>
          <TextInput
            {...shared}
            className="min-w-0 flex-1 px-3 text-[14px]"
            style={{ color: palette.heading, outlineStyle: "none" } as never}
          />
          <Text
            className="pr-3 text-[12px] font-semibold"
            style={{ color: palette.subtle }}
            accessibilityElementsHidden
            importantForAccessibility="no"
          >
            {field.unit}
          </Text>
        </View>
        <FieldHelper helper={helper} error={error} palette={palette} />
      </View>
    );
  }

  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />
      <TextInput
        {...shared}
        multiline={isMultiline}
        numberOfLines={isMultiline ? 4 : 1}
        className={`px-3 text-[14px] ${isMultiline ? "py-2.5" : "h-11"}`}
        style={[boxStyle, isMultiline ? { minHeight: 88, textAlignVertical: "top" } : null]}
      />
      <FieldHelper helper={helper} error={error} palette={palette} />
    </View>
  );
};

export default TextField;
