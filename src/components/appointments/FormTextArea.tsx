import { useState } from "react";
import { Platform, Text, TextInput, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS, TEXT_LIMIT } from "./appointmentTheme";
import FieldLabel from "./FieldLabel";

type FormTextAreaProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  placeholder: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  onChangeText: (next: string) => void;
  error?: string | null;
  maxLength?: number;
  minHeight?: number;
};

/**
 * Multi-line field with a live character count.
 *
 * The counter sits inside the box, bottom-right, and the input's own
 * `maxLength` enforces the ceiling — so the count describes what the field
 * will accept rather than warning about something it already let through.
 */
export default function FormTextArea({
  label,
  required = false,
  optional = false,
  placeholder,
  icon,
  value,
  onChangeText,
  error = null,
  maxLength = TEXT_LIMIT,
  minHeight = 96,
}: FormTextAreaProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View className="w-full">
      <FieldLabel label={label} required={required} optional={optional} />

      <View
        style={{
          borderRadius: APPOINTMENT_METRICS.radiusField,
          borderWidth: hasError || focused ? 1.5 : 1,
          borderColor: hasError
            ? APPOINTMENT_COLORS.danger
            : focused
              ? APPOINTMENT_COLORS.primaryBright
              : APPOINTMENT_COLORS.border,
          backgroundColor: APPOINTMENT_COLORS.white,
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: 8,
        }}
      >
        <View className="flex-row" style={{ gap: 9 }}>
          <MaterialCommunityIcons
            name={icon}
            size={19}
            color={hasError ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.primaryBright}
            style={{ marginTop: 2 }}
          />
          <TextInput
            accessibilityLabel={required ? `${label}, required` : label}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            placeholderTextColor={APPOINTMENT_COLORS.placeholder}
            multiline
            maxLength={maxLength}
            textAlignVertical="top"
            className="min-w-0 flex-1"
            style={{
              minHeight,
              fontSize: 14.5,
              lineHeight: 20,
              color: APPOINTMENT_COLORS.bodyText,
              padding: 0,
              ...Platform.select({ web: { outlineStyle: "none" } as any }),
            }}
          />
        </View>

        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          className="self-end"
          style={{ fontSize: 11.5, color: APPOINTMENT_COLORS.placeholder }}
        >
          {value.length}/{maxLength}
        </Text>
      </View>

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
      ) : null}
    </View>
  );
}
