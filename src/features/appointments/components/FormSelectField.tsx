import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { APPOINTMENT_COLORS, APPOINTMENT_METRICS } from "./appointmentTheme";
import FieldLabel from "./FieldLabel";

export type SelectOption = {
  id: string;
  label: string;
  /** Second line in the sheet — a role, a duration, a short description. */
  helper?: string;
};

type FormSelectFieldProps = {
  label: string;
  required?: boolean;
  placeholder: string;
  /** Title shown at the top of the picker sheet. */
  sheetTitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  options: SelectOption[];
  value: string | null;
  onChange: (id: string) => void;
  /** Inline validation message; also puts the field into its error state. */
  error?: string | null;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  /** Shown inside the sheet when there is nothing to choose from. */
  emptyText?: string;
  /** One quiet line under the field, e.g. what the chosen service covers. */
  helperText?: string | null;
};

/**
 * A select that opens a bottom sheet rather than a dropdown.
 *
 * A dropdown anchored to the field is a desktop pattern: on a 360px phone it
 * either covers the field it belongs to or scrolls the page underneath it. A
 * sheet rises from the thumb, gives every option a full-width 54px row, and is
 * dismissed the way the rest of the app's sheets are — which is why both the
 * service and the provider pickers share this one component instead of each
 * growing their own.
 */
export default function FormSelectField({
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
}: FormSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const { height } = useWindowDimensions();

  const selected = options.find((option) => option.id === value) ?? null;
  const isDisabled = disabled || loading;
  const hasError = Boolean(error);

  const borderColor = hasError
    ? APPOINTMENT_COLORS.danger
    : open
      ? APPOINTMENT_COLORS.primaryBright
      : APPOINTMENT_COLORS.border;

  return (
    <View className="w-full">
      <FieldLabel label={label} required={required} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={`Opens the ${label.toLowerCase()} picker`}
        accessibilityState={{ disabled: isDisabled, expanded: open }}
        accessibilityValue={{ text: selected?.label ?? placeholder }}
        disabled={isDisabled}
        onPress={() => setOpen(true)}
        className="w-full flex-row items-center"
        style={{
          height: APPOINTMENT_METRICS.fieldHeight,
          paddingHorizontal: 14,
          gap: 10,
          borderRadius: APPOINTMENT_METRICS.radiusField,
          borderWidth: hasError || open ? 1.5 : 1,
          borderColor,
          backgroundColor: isDisabled ? "#F7F9FC" : APPOINTMENT_COLORS.white,
          opacity: isDisabled ? 0.75 : 1,
          ...Platform.select({ web: { cursor: isDisabled ? "default" : "pointer" } as any }),
        }}
      >
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={hasError ? APPOINTMENT_COLORS.danger : APPOINTMENT_COLORS.primaryBright}
        />

        {loading ? (
          <View className="min-w-0 flex-1 flex-row items-center gap-2">
            <ActivityIndicator size="small" color={APPOINTMENT_COLORS.primaryBright} />
            <Text style={{ fontSize: 15, color: APPOINTMENT_COLORS.mutedText }}>{loadingText}</Text>
          </View>
        ) : (
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1"
            style={{
              fontSize: 15,
              fontWeight: selected ? "600" : "400",
              color: selected ? APPOINTMENT_COLORS.bodyText : APPOINTMENT_COLORS.placeholder,
            }}
          >
            {selected?.label ?? placeholder}
          </Text>
        )}

        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color={APPOINTMENT_COLORS.mutedText}
        />
      </Pressable>

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

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,37,87,0.4)" }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Close ${label.toLowerCase()} picker`}
            onPress={() => setOpen(false)}
            style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          />

          <View
            accessibilityViewIsModal
            style={{
              backgroundColor: APPOINTMENT_COLORS.white,
              borderTopLeftRadius: APPOINTMENT_METRICS.radiusSheet,
              borderTopRightRadius: APPOINTMENT_METRICS.radiusSheet,
              paddingBottom: 18,
              maxHeight: Math.max(height * 0.7, 280),
            }}
          >
            <View className="items-center pt-3">
              <View
                style={{
                  width: 42,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: APPOINTMENT_COLORS.track,
                }}
              />
            </View>

            <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
              <Text
                accessibilityRole="header"
                style={{ fontSize: 16, fontWeight: "700", color: APPOINTMENT_COLORS.primaryDeep }}
              >
                {sheetTitle ?? label}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={12}
                onPress={() => setOpen(false)}
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: APPOINTMENT_COLORS.surfaceTint }}
              >
                <Feather name="x" size={16} color={APPOINTMENT_COLORS.mutedText} />
              </Pressable>
            </View>

            <View style={{ height: 1, backgroundColor: APPOINTMENT_COLORS.divider }} />

            {options.length === 0 ? (
              <View className="items-center px-6 py-8">
                <MaterialCommunityIcons
                  name="calendar-remove-outline"
                  size={26}
                  color={APPOINTMENT_COLORS.mutedText}
                />
                <Text
                  className="mt-2 text-center"
                  style={{ fontSize: 13.5, color: APPOINTMENT_COLORS.mutedText }}
                >
                  {emptyText}
                </Text>
              </View>
            ) : (
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {options.map((option, index) => {
                  const isSelected = option.id === value;
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityRole="button"
                      accessibilityLabel={option.label}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => {
                        onChange(option.id);
                        setOpen(false);
                      }}
                      className="w-full flex-row items-center justify-between px-5 active:opacity-70"
                      style={{
                        minHeight: APPOINTMENT_METRICS.optionMinHeight,
                        paddingVertical: 12,
                        gap: 12,
                        backgroundColor: isSelected
                          ? APPOINTMENT_COLORS.surfaceTint
                          : APPOINTMENT_COLORS.white,
                        borderBottomWidth: index === options.length - 1 ? 0 : 1,
                        borderBottomColor: APPOINTMENT_COLORS.divider,
                      }}
                    >
                      <View className="min-w-0 flex-1">
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: isSelected ? "700" : "500",
                            color: isSelected
                              ? APPOINTMENT_COLORS.primary
                              : APPOINTMENT_COLORS.bodyText,
                          }}
                        >
                          {option.label}
                        </Text>
                        {option.helper ? (
                          <Text
                            className="mt-0.5"
                            style={{ fontSize: 12.5, color: APPOINTMENT_COLORS.mutedText }}
                          >
                            {option.helper}
                          </Text>
                        ) : null}
                      </View>

                      {isSelected ? (
                        <Feather name="check" size={18} color={APPOINTMENT_COLORS.primaryBright} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
