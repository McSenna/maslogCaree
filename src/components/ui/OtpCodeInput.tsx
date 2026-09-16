import { useRef } from "react";
import { Platform, TextInput, View } from "react-native";

export type OtpPalette = {
  border: string;
  primary: string;
  primarySoft: string;
  surface: string;
  text: string;
  error: string;
  errorSoft: string;
};

type OtpCodeInputProps = {
  value: string;
  onChange: (next: string) => void;
  palette: OtpPalette;
  length?: number;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  boxHeight?: number;
};

const OtpCodeInput = ({
  value,
  onChange,
  palette,
  length = 6,
  onComplete,
  disabled,
  hasError,
  boxHeight = 56,
}: OtpCodeInputProps) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange = (text: string, index: number) => {
    const clean = text.replace(/\D/g, "");
    if (!clean) return;

    const next = (value.slice(0, index) + clean + value.slice(index + clean.length)).slice(
      0,
      length
    );

    commit(next);
    inputs.current[Math.min(index + clean.length, length - 1)]?.focus();
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key !== "Backspace") return;
    const target = digits[index] ? index : index - 1;
    if (target < 0) return;
    commit(value.slice(0, target) + value.slice(target + 1));
    inputs.current[target]?.focus();
  };

  return (
    <View
      style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}
      accessibilityLabel="Verification code"
    >
      {digits.map((digit, index) => {
        const filled = Boolean(digit);
        return (
          <TextInput
            key={index}
            ref={(element) => {
              inputs.current[index] = element;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event.nativeEvent.key, index)}
            editable={!disabled}
            keyboardType="number-pad"
            inputMode="numeric"
            textContentType="oneTimeCode"
            autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
            maxLength={length}
            selectTextOnFocus
            accessibilityLabel={`Digit ${index + 1} of ${length}`}
            style={{
              flex: 1,
              height: boxHeight,
              textAlign: "center",
              fontSize: 20,
              fontWeight: "700",
              borderRadius: 14,
              borderWidth: filled || hasError ? 1.5 : 1,
              borderColor: hasError ? palette.error : filled ? palette.primary : palette.border,
              backgroundColor: hasError
                ? palette.errorSoft
                : filled
                  ? palette.primarySoft
                  : palette.surface,
              color: palette.text,
              opacity: disabled ? 0.6 : 1,
              ...Platform.select({ web: { outlineStyle: "none" } as object }),
            }}
          />
        );
      })}
    </View>
  );
};

export default OtpCodeInput;
