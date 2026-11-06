import { Feather } from "@expo/vector-icons";
import { useId, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from "react";
import { Platform, TextInput, View, type TextInputProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { webStyle } from "@/theme/webStyle";
import FieldLayout from "./FieldLayout";
import FieldMessage from "./FieldMessage";
import SecureToggle from "./SecureToggle";
import { fieldBoxStyle, resolveFieldAppearance } from "./fieldAppearance";
import { useSecureReveal } from "./useSecureReveal";

export type TextFieldProps = Omit<TextInputProps, "style" | "editable"> & {
  label: string;
  error?: string | null;
  helper?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: keyof typeof Feather.glyphMap;
  secureToggle?: boolean;
  /** Names for the show/hide button; default to "Show <label>" and "Hide <label>". */
  toggleLabels?: { show: string; hide: string };
  inputRef?: Ref<TextInput>;
  /** The input's id, which also ties a real label element to it on web. */
  inputId?: string;
  /** A short count shown at the end of the message row, such as "12 / 800". */
  counter?: string;
  /** Takes focus when its dialog opens. */
  initialFocus?: boolean;
  /** Replaces the default height of a multiline input. */
  inputMinHeight?: number;
  /** `start` puts the label in a fixed column beside the input, for wide forms. */
  labelPosition?: "top" | "start";
  labelWidth?: number;
  size?: "md" | "lg";
  /** Extra content under the message, in the input's column (a checklist, say). */
  below?: ReactNode;
  /** Ids of other elements that describe the input, added after the message's. */
  describedBy?: string;
};

const MULTILINE_INPUT = { minHeight: 120, maxHeight: 200, paddingTop: 12, paddingBottom: 12, lineHeight: 23 } as const;
const FIELD_HEIGHT = { md: 46, lg: 52 } as const;

const TextField = ({
  label,
  error,
  helper,
  success = false,
  disabled = false,
  required = false,
  leftIcon,
  secureToggle = false,
  toggleLabels,
  inputRef,
  inputId,
  counter,
  initialFocus = false,
  inputMinHeight,
  labelPosition = "top",
  labelWidth = 200,
  size = "md",
  below,
  describedBy,
  secureTextEntry,
  onFocus,
  onBlur,
  onSelectionChange,
  ...inputProps
}: TextFieldProps) => {
  const colors = useThemeColors();
  const messageId = useId();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const localInputRef = useRef<TextInput>(null);
  // The field keeps its own ref (the reveal toggle restores the caret through it) and hands the input to the caller's.
  useImperativeHandle(inputRef, () => localInputRef.current as TextInput, []);
  const reveal = useSecureReveal(localInputRef);
  const look = resolveFieldAppearance(colors, { focused, hovered, error: Boolean(error), success, disabled });
  const hidden = secureToggle ? !reveal.revealed : secureTextEntry;
  const multiline = Boolean(inputProps.multiline);
  const describedByIds = [error || helper ? messageId : null, describedBy].filter(Boolean).join(" ") || undefined;

  const message = (
    <FieldMessage nativeID={messageId} error={error} helper={helper} counter={counter} />
  );

  const control = (
    <View
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={fieldBoxStyle(look, { minHeight: FIELD_HEIGHT[size], multiline, trailingButton: secureToggle, disabled })}
    >
      {leftIcon ? (
        <Feather name={leftIcon} size={16} color={look.icon} style={multiline ? { marginTop: 15 } : undefined} />
      ) : null}
      <TextInput
        ref={localInputRef}
        nativeID={inputId}
        {...inputProps}
        {...(initialFocus ? (Platform.OS === "web" ? { dataSet: { initialFocus: "true" } } : { autoFocus: true }) : {})}
        editable={!disabled}
        secureTextEntry={hidden}
        accessibilityLabel={inputProps.accessibilityLabel ?? label}
        aria-invalid={Boolean(error) || undefined}
        aria-required={required || undefined}
        aria-describedby={describedByIds}
        placeholderTextColor={colors.subtle}
        onSelectionChange={(event) => {
          reveal.trackSelection(event);
          onSelectionChange?.(event);
        }}
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
        <SecureToggle
          revealed={reveal.revealed}
          onToggle={reveal.toggle}
          showLabel={toggleLabels?.show ?? `Show ${label.toLowerCase()}`}
          hideLabel={toggleLabels?.hide ?? `Hide ${label.toLowerCase()}`}
          disabled={disabled}
        />
      ) : success ? (
        <Feather name="check-circle" size={16} color={colors.success.fg} />
      ) : null}
    </View>
  );

  return (
    <FieldLayout
      label={label}
      required={required}
      inputId={inputId}
      position={labelPosition}
      labelWidth={labelWidth}
      controlHeight={FIELD_HEIGHT[size]}
      control={control}
      message={message}
      below={below}
    />
  );
};

export default TextField;
