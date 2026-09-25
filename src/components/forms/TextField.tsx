import { Feather } from "@expo/vector-icons";
import { useId, useState, type Ref } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { TIMING } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";
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
};

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

  return (
    <View style={{ width: "100%", gap: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: "600", color: colors.heading }}>
        {label}
        {required ? <Text style={{ color: colors.danger.fg }}> *</Text> : null}
      </Text>

      <View
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={[
          {
            minHeight: 46,
            flexDirection: "row",
            alignItems: "center",
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
        {leftIcon ? <Feather name={leftIcon} size={16} color={look.icon} /> : null}
        <TextInput
          ref={inputRef}
          {...inputProps}
          editable={!disabled}
          secureTextEntry={hidden}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          aria-invalid={Boolean(error) || undefined}
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
          style={[{ flex: 1, minWidth: 0, minHeight: 44, fontSize: 15, color: colors.heading }, webStyle({ outlineStyle: "none" })]}
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

      <FieldMessage nativeID={messageId} error={error} helper={helper} />
    </View>
  );
};

export default TextField;
