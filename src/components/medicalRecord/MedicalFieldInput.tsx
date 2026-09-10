import { useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import type { MedicalField } from "@/services/medicalRecords";
import { QUEUE_RADIUS, useQueuePalette, type QueuePalette } from "@/components/appointmentQueue/queueTheme";

export type FieldValue = string | number | boolean | null | undefined;

/** "2026-10-15" from a Date, in local time — never the UTC shift `toISOString` gives. */
export function toDateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseDateKey(value: FieldValue): Date {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [y, m, d] = value.slice(0, 10).split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }
  return new Date();
}

function FieldLabel({ field, palette }: { field: MedicalField; palette: QueuePalette }) {
  return (
    <View className="mb-1.5 flex-row items-center gap-1">
      <Text className="text-[13px] font-semibold" style={{ color: palette.body }}>
        {field.label}
      </Text>
      {field.required ? (
        <Text className="text-[13px] font-semibold" style={{ color: "#DC2626" }}>
          *
        </Text>
      ) : null}
    </View>
  );
}

/**
 * One control, chosen by the field's declared type.
 *
 * The type comes from the server catalogue, which is also what validates the
 * submission — so a control here can never collect something the server will
 * refuse for being the wrong shape.
 */
export default function MedicalFieldInput({
  field,
  value,
  onChange,
  error,
  disabled,
}: {
  field: MedicalField;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  error?: string;
  disabled?: boolean;
}) {
  const palette = useQueuePalette();
  const [pickerOpen, setPickerOpen] = useState(false);

  const boxStyle = {
    borderRadius: QUEUE_RADIUS.control,
    borderWidth: 1,
    borderColor: error ? "#DC2626" : palette.panelBorder,
    backgroundColor: palette.isDark ? "#0B1220" : "#FFFFFF",
    color: palette.heading,
    opacity: disabled ? 0.6 : 1,
  } as const;

  const helper = error ?? field.helper;

  // A yes/no answer is a two-button segment, not a switch: on a phone the
  // current state of a switch is one glance away from being misread, and a
  // follow-up flag that reads wrong sends a patient home without one.
  if (field.type === "boolean") {
    const on = value === true;
    return (
      <View className="w-full">
        <FieldLabel field={field} palette={palette} />
        <View
          className="flex-row overflow-hidden self-start"
          style={{ borderRadius: QUEUE_RADIUS.control, borderWidth: 1, borderColor: palette.panelBorder }}
        >
          {[
            { label: "No", selected: !on, next: false },
            { label: "Yes", selected: on, next: true },
          ].map((option) => (
            <Pressable
              key={option.label}
              onPress={() => !disabled && onChange(option.next)}
              accessibilityRole="radio"
              accessibilityState={{ selected: option.selected, disabled }}
              accessibilityLabel={`${field.label}: ${option.label}`}
              className="h-10 items-center justify-center px-6"
              style={{ backgroundColor: option.selected ? palette.primary : "transparent" }}
            >
              <Text
                className="text-[13.5px] font-semibold"
                style={{ color: option.selected ? "#FFFFFF" : palette.muted }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {helper ? (
          <Text className="mt-1 text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
            {helper}
          </Text>
        ) : null}
      </View>
    );
  }

  if (field.type === "select") {
    return (
      <View className="w-full">
        <FieldLabel field={field} palette={palette} />
        <View className="flex-row flex-wrap gap-2">
          {(field.options ?? []).map((option) => {
            const selected = value === option.value;
            return (
              <Pressable
                key={option.value}
                // Tapping the selected chip clears it — every select here is
                // optional, and without this there is no way back to "unset".
                onPress={() => !disabled && onChange(selected ? null : option.value)}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled }}
                accessibilityLabel={option.label}
                className="h-9 items-center justify-center px-3.5"
                style={{
                  borderRadius: QUEUE_RADIUS.pill,
                  borderWidth: 1,
                  borderColor: selected ? palette.primary : palette.panelBorder,
                  backgroundColor: selected ? palette.primarySoft : "transparent",
                }}
              >
                <Text
                  className={`text-[13px] ${selected ? "font-semibold" : "font-medium"}`}
                  style={{ color: selected ? palette.primary : palette.muted }}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {helper ? (
          <Text className="mt-1 text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
            {helper}
          </Text>
        ) : null}
      </View>
    );
  }

  if (field.type === "date") {
    const display = typeof value === "string" && value ? value.slice(0, 10) : "";

    return (
      <View className="w-full">
        <FieldLabel field={field} palette={palette} />

        {/* Web gets a typed date; the native picker is not available there and
            a browser's own date control cannot be reached through RN Web. */}
        {Platform.OS === "web" ? (
          <TextInput
            value={display}
            onChangeText={(text) => onChange(text)}
            editable={!disabled}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={palette.subtle}
            accessibilityLabel={field.label}
            className="h-11 px-3 text-[14px]"
            style={boxStyle}
          />
        ) : (
          <Pressable
            onPress={() => !disabled && setPickerOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={`${field.label}${display ? `: ${display}` : ", not set"}`}
            className="h-11 flex-row items-center justify-between px-3"
            style={boxStyle}
          >
            <Text className="text-[14px]" style={{ color: display ? palette.heading : palette.subtle }}>
              {display || "Select a date"}
            </Text>
            <Feather name="calendar" size={16} color={palette.muted} />
          </Pressable>
        )}

        <View className="mt-1 flex-row items-center justify-between">
          <Text className="text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
            {helper ?? ""}
          </Text>
          {display ? (
            <Pressable
              onPress={() => !disabled && onChange(null)}
              accessibilityRole="button"
              accessibilityLabel={`Clear ${field.label}`}
              hitSlop={10}
            >
              <Text className="text-[11.5px] font-semibold" style={{ color: palette.primary }}>
                Clear
              </Text>
            </Pressable>
          ) : null}
        </View>

        {pickerOpen && Platform.OS !== "web" ? (
          <DateTimePicker
            value={parseDateKey(value)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event: { type?: string }, date?: Date) => {
              setPickerOpen(false);
              if (event?.type === "dismissed" || !date) return;
              onChange(toDateKey(date));
            }}
          />
        ) : null}
      </View>
    );
  }

  const isMultiline = field.type === "textarea";

  return (
    <View className="w-full">
      <FieldLabel field={field} palette={palette} />
      <TextInput
        value={value === null || value === undefined ? "" : String(value)}
        onChangeText={(text) => {
          if (field.type !== "number") {
            onChange(text);
            return;
          }
          // Kept as typed rather than coerced on every keystroke: parsing here
          // makes "12." impossible to type on the way to "12.5", and the
          // server validates the number anyway.
          onChange(text.replace(/[^0-9.\-]/g, ""));
        }}
        editable={!disabled}
        multiline={isMultiline}
        numberOfLines={isMultiline ? 4 : 1}
        maxLength={field.maxLength}
        keyboardType={field.type === "number" ? "numeric" : "default"}
        placeholderTextColor={palette.subtle}
        accessibilityLabel={field.label}
        className={`px-3 text-[14px] ${isMultiline ? "py-2.5" : "h-11"}`}
        style={[boxStyle, isMultiline ? { minHeight: 88, textAlignVertical: "top" } : null]}
      />
      {helper ? (
        <Text className="mt-1 text-[11.5px]" style={{ color: error ? "#DC2626" : palette.subtle }}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
