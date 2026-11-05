import { Feather } from "@expo/vector-icons";
import { useId, useState, type Ref } from "react";
import { Platform, Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { TIMING } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";
import FieldLabel from "./FieldLabel";
import FieldMessage from "./FieldMessage";
import { resolveFieldAppearance } from "./fieldAppearance";

export type TextFieldProps = Omit<TextInputProps, "style" | "editable"> & {
  label: string;
  error?: string | null;
  helper?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: keyof typeof Feather.glyphMap;
  secureToggle?: boolean;
  inputRef?: Ref<TextInput>;
  /** The input's id, which also ties a real label element to it on web. */
  inputId?: string;
  /** A short count shown at the end of the message row, such as "12 / 800". */
  counter?: string;
  /** Takes focus when its dialog opens. */
  initialFocus?: boolean;
  /** Replaces the default height of a multiline input. */
  inputMinHeight?: number;
};

const MULTILINE_INPUT = { minHeight: 120, maxHeight: 200, paddingTop: 12, paddingBottom: 12, lineHeight: 23 } as const;

const TextField = ({
  label,
  error,
  helper,
  success = false,
  disabled = false,
  required = false,
  leftIcon,
  secureToggle = false,
  inputRef,
  inputId,
  counter,
  initialFocus = false,
  inputMinHeight,
  secureTextEntry,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) => {
  const colors = useThemeColors();
  const messageId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const look = resolveFieldAppearance(colors, { focused, hovered, error: Boolean(error), success, disabled });
  const hidden = secureToggle ? !revealed : secureTextEntry;
  const multiline = Boolean(inputProps.multiline);

  return (
    <View style={{ width: "100%", gap: 6 }}>
      <FieldLabel htmlFor={inputId}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.heading }}>
          {label}
          {required ? <Text style={{ color: colors.danger.fg }}> *</Text> : null}
        </Text>
      </FieldLabel>

      <View
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={[
          {
            minHeight: 46,
            flexDirection: "row",
            alignItems: multiline ? "flex-start" : "center",
            gap: 10,
            paddingHorizontal: 14,
            borderRadius: RADII.medium,
            borderWidth: look.borderWidth,
            borderColor: look.border,
            backgroundColor: look.background,
            opacity: disabled ? 0.7 : 1,
          },
          webStyle({
            transition: `border-color ${TIMING.hover}ms ease, box-shadow ${TIMING.hover}ms ease`,
            boxShadow: look.ring ? `0 0 0 3px ${look.ring}` : "none",
          }),
        ]}
      >
        {leftIcon ? (
          <Feather name={leftIcon} size={16} color={look.icon} style={multiline ? { marginTop: 15 } : undefined} />
        ) : null}
        <TextInput
          ref={inputRef}
          nativeID={inputId}
          {...inputProps}
          {...(initialFocus ? (Platform.OS === "web" ? { dataSet: { initialFocus: "true" } } : { autoFocus: true }) : {})}
          editable={!disabled}
          secureTextEntry={hidden}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          aria-invalid={Boolean(error) || undefined}
          aria-required={required || undefined}
          aria-describedby={error || helper ? messageId : undefined}
          placeholderTextColor={colors.subtle}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          textAlignVertical={multiline ? "top" : inputProps.textAlignVertical}
          style={[
            { flex: 1, minWidth: 0, minHeight: 44, fontSize: 17, color: colors.heading },
            multiline ? MULTILINE_INPUT : null,
            multiline && inputMinHeight ? { minHeight: inputMinHeight, maxHeight: inputMinHeight } : null,
            webStyle({ outlineStyle: "none" }),
          ]}
        />
        {secureToggle ? (
          <Pressable
            onPress={() => setRevealed((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel={revealed ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            hitSlop={10}
            style={{ padding: 4 }}
          >
            <Feather name={revealed ? "eye-off" : "eye"} size={17} color={colors.muted} />
          </Pressable>
        ) : success ? (
          <Feather name="check-circle" size={16} color={colors.success.fg} />
        ) : null}
      </View>

      {counter ? (
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <FieldMessage nativeID={messageId} error={error} helper={helper} />
          </View>
          <Text style={{ fontSize: 14.5, lineHeight: 19, color: colors.muted, fontVariant: ["tabular-nums"] }}>{counter}</Text>
        </View>
      ) : (
        <FieldMessage nativeID={messageId} error={error} helper={helper} />
      )}
    </View>
  );
};

export default TextField;
