import { Platform, Pressable, TextInput } from "react-native";
import { INPUT_SHELL_PROPS } from "@/components/ui/inputShell";
import { webStyle } from "@/theme/webStyle";
import type { OtpPalette } from "./otpTypes";
import type { OtpInputController } from "./useOtpInput";

type OtpBoxProps = {
  index: number;
  digit: string;
  length: number;
  label: string;
  palette: OtpPalette;
  controller: OtpInputController;
  disabled: boolean;
  invalid: boolean;
  success: boolean;
  describedBy?: string;
  reducedMotion: boolean;
};

const OtpBox = ({ index, digit, length, label, palette, controller, disabled, invalid, success, describedBy, reducedMotion }: OtpBoxProps) => {
  const { metrics, focusedIndex, hoveredIndex, setFocusedIndex, setHoveredIndex } = controller;
  const focused = focusedIndex === index;
  const hovered = hoveredIndex === index && !disabled;
  const filled = Boolean(digit);
  const borderColor = invalid
    ? palette.error
    : success
      ? palette.success
      : focused
        ? palette.primary
        : hovered || filled
          ? palette.borderHover
          : palette.border;
  const ring = focused ? (invalid ? palette.errorRing : palette.primaryRing) : null;
  const webInputProps =
    Platform.OS === "web" ? ({ "aria-invalid": invalid || undefined, "aria-describedby": describedBy } as object) : {};

  return (
    <Pressable
      {...INPUT_SHELL_PROPS}
      accessible={false}
      focusable={false}
      disabled={disabled}
      onPress={() => controller.focusBox(index)}
      onHoverIn={() => setHoveredIndex(index)}
      onHoverOut={() => setHoveredIndex((current) => (current === index ? null : current))}
      style={[
        {
          width: metrics.boxWidth,
          height: metrics.boxHeight,
          borderRadius: 12,
          borderWidth: focused || invalid ? 2 : 1.5,
          borderColor,
          backgroundColor: disabled ? palette.disabled : filled ? palette.surfaceFilled : palette.surface,
          boxShadow: ring ? `0px 0px 0px 3px ${ring}` : "0px 0px 0px 0px rgba(0,0,0,0)",
          alignItems: "center",
          justifyContent: "center",
        },
        webStyle({
          cursor: disabled ? "not-allowed" : "text",
          transition: reducedMotion ? "none" : "border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease",
        }),
      ]}
    >
      <TextInput
        ref={controller.registerInput(index)}
        {...webInputProps}
        value={digit}
        onChangeText={(text) => controller.handleChangeText(text, index)}
        onKeyPress={(event) => controller.handleKeyPress(event, index)}
        onSubmitEditing={controller.handleSubmitEditing}
        onFocus={() => setFocusedIndex(index)}
        onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
        editable={!disabled}
        // Room for a pasted code with separators ("123 456"); the handler keeps one digit per box.
        maxLength={length + 4}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="done"
        submitBehavior="submit"
        selectTextOnFocus
        caretHidden={Platform.OS !== "web"}
        accessibilityLabel={`${label}, digit ${index + 1} of ${length}`}
        accessibilityState={{ disabled }}
        style={[
          {
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontSize: metrics.fontSize,
            fontWeight: "700",
            color: palette.text,
            padding: 0,
            borderWidth: 0,
            backgroundColor: "transparent",
            fontVariant: ["tabular-nums"],
          },
          webStyle({ outlineStyle: "none" }),
        ]}
      />
    </Pressable>
  );
};

export default OtpBox;
