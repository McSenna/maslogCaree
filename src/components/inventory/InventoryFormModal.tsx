import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectMenu, { type SelectOption } from "@/components/users/SelectMenu";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { CONTROL_HEIGHT, RADIUS, useInventoryPalette } from "./inventoryTheme";

type InventoryFormModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  submitLabel: string;
  /** Disabled while a required field is empty, so the server is not asked to validate first. */
  submitDisabled?: boolean;
  submitting?: boolean;
  error?: string | null;
  onSubmit: () => void;
  onClose: () => void;
  children: ReactNode;
};

/**
 * The shell every inventory flow is presented in.
 *
 * One component, so Add Item, Edit Item, Add Stock and Release Stock cannot
 * drift apart in header, spacing or button placement — and so the keyboard
 * behaviour only has to be right in one place.
 *
 * Two presentations of it: a centred dialog where there is room, and a bottom
 * sheet on a phone. A form is the worst thing to float in the middle of a small
 * screen — the keyboard covers it, and the submit button ends up somewhere no
 * thumb reaches. Anchored to the bottom edge instead, the fields rise above the
 * keyboard and the actions stay where the hand already is.
 */
export default function InventoryFormModal({
  visible,
  title,
  subtitle,
  icon,
  submitLabel,
  submitDisabled = false,
  submitting = false,
  error,
  onSubmit,
  onClose,
  children,
}: InventoryFormModalProps) {
  const palette = useInventoryPalette();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  // The app's tablet line, the same one User Management and the shell switch on.
  const isMobile = width < BREAKPOINTS.tablet;

  const header = (
    <View
      className={`flex-row items-center gap-3 ${isMobile ? "px-4 pb-3 pt-1" : "px-5 py-4"}`}
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <View
        className="h-10 w-10 items-center justify-center"
        style={{ backgroundColor: palette.bannerBg, borderRadius: 12 }}
      >
        <Feather name={icon} size={19} color={palette.primary} />
      </View>
      <View className="min-w-0 flex-1">
        <Text accessibilityRole="header" className="text-[16px] font-bold" style={{ color: palette.heading }}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-[12.5px]" numberOfLines={2} style={{ color: palette.muted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={`Close ${title}`}
        hitSlop={12}
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.divider }}
      >
        <Feather name="x" size={15} color={palette.muted} />
      </Pressable>
    </View>
  );

  const body = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: isMobile ? 16 : 20, gap: 14 }}
    >
      {children}

      {error ? (
        <View
          className="flex-row items-start gap-2 border p-3"
          style={{ borderRadius: RADIUS.control, backgroundColor: "#FEF2F2", borderColor: "#FECACA" }}
        >
          <Feather name="alert-circle" size={14} color={palette.danger} />
          <Text className="min-w-0 flex-1 text-[12.5px] font-medium" style={{ color: palette.danger }}>
            {error}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );

  const footer = (
    <View
      className={`flex-row gap-2.5 ${isMobile ? "px-4 pt-3" : "px-5 py-4"}`}
      style={{
        borderTopWidth: 1,
        borderTopColor: palette.divider,
        // Clears the Android gesture bar / home indicator, which the sheet sits
        // directly on top of.
        ...(isMobile ? { paddingBottom: Math.max(insets.bottom, 12) + 4 } : null),
      }}
    >
      <Pressable
        onPress={onClose}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel="Cancel"
        className="flex-1 items-center justify-center border active:opacity-85"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: RADIUS.control,
          backgroundColor: palette.cardBg,
          borderColor: palette.cardBorder,
        }}
      >
        <Text className="text-[14px] font-semibold" style={{ color: palette.body }}>
          Cancel
        </Text>
      </Pressable>

      <Pressable
        onPress={onSubmit}
        disabled={submitDisabled || submitting}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        accessibilityState={{ disabled: submitDisabled || submitting }}
        className="flex-1 flex-row items-center justify-center gap-2 active:opacity-85"
        style={{
          height: CONTROL_HEIGHT,
          borderRadius: RADIUS.control,
          backgroundColor: palette.primary,
          opacity: submitDisabled || submitting ? 0.55 : 1,
        }}
      >
        {submitting ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
        <Text className="text-[14px] font-semibold text-white">
          {submitting ? "Saving…" : submitLabel}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      // Rises from the bottom edge on a phone, where the sheet is anchored
      // there; a centred dialog has nowhere to rise from and just fades.
      animationType={isMobile ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className={`flex-1 ${isMobile ? "justify-end" : "items-center justify-center p-4"}`}
        style={{ backgroundColor: "rgba(15,37,87,0.35)" }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Close ${title}`}
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <View
          className={`w-full overflow-hidden ${isMobile ? "" : "border"}`}
          style={
            isMobile
              ? {
                  // Taller than the read-only sheets: this one holds a form, and
                  // every row the admin cannot see is a row they have to hunt for.
                  maxHeight: height * 0.92,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  backgroundColor: palette.cardBg,
                  shadowColor: "#0F2557",
                  shadowOpacity: 0.2,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: -6 },
                  elevation: 16,
                }
              : {
                  maxWidth: 460,
                  maxHeight: height * 0.88,
                  borderRadius: RADIUS.card,
                  backgroundColor: palette.cardBg,
                  borderColor: palette.cardBorder,
                  shadowColor: "#0F2557",
                  shadowOpacity: 0.18,
                  shadowRadius: 28,
                  shadowOffset: { width: 0, height: 12 },
                  elevation: 12,
                }
          }
        >
          {/* Grab handle — the affordance that says this panel can be dismissed.
              Static, as on the other inventory sheets: a form should not be
              swipe-dismissable, because a stray drag would discard typed input. */}
          {isMobile ? (
            <View className="items-center pb-1 pt-2.5">
              <View
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
              />
            </View>
          ) : null}

          {header}
          {body}
          {footer}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  /** Guidance under the control — units, limits, what the server will accept. */
  helper?: string | null;
  error?: string | null;
  children: ReactNode;
};

export function Field({ label, required = false, helper, error, children }: FieldProps) {
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
}

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

export function TextField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  keyboardType = "default",
  multiline = false,
  editable = true,
  maxLength,
}: TextFieldProps) {
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
}

/** A read-only value the flow needs to show but never lets the user change. */
export function ReadOnlyValue({ value }: { value: string }) {
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
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}) {
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
}
