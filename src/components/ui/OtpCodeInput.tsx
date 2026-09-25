import { Platform, View } from "react-native";
import OtpBox from "./otp/OtpBox";
import type { OtpPalette } from "./otp/otpTypes";
import { useOtpInput } from "./otp/useOtpInput";

export type { OtpPalette } from "./otp/otpTypes";

type OtpCodeInputProps = {
  /** Digits entered so far; a space marks an empty box between filled ones. */
  value: string;
  onChange: (next: string) => void;
  /** Called on Enter/Done, only once every box holds a digit. */
  onSubmit?: (code: string) => void;
  palette: OtpPalette;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  success?: boolean;
  /** Accessible name of the whole group, e.g. "Verification code". */
  label: string;
  /** nativeID of the status message, so screen readers read errors with the field. */
  describedBy?: string;
  /** Changing this number moves focus to the first empty box (after resend, expiry…). */
  focusRequest?: number;
  reducedMotion?: boolean;
};

const OtpCodeInput = ({
  value,
  onChange,
  onSubmit,
  palette,
  length = 6,
  disabled = false,
  invalid = false,
  success = false,
  label,
  describedBy,
  focusRequest,
  reducedMotion = false,
}: OtpCodeInputProps) => {
  const controller = useOtpInput({ value, onChange, onSubmit, length, focusRequest });
  const webGroupProps = Platform.OS === "web" ? ({ role: "group", "aria-label": label } as object) : {};

  return (
    <View onLayout={controller.onLayout} style={{ width: "100%" }}>
      <View
        {...webGroupProps}
        accessible={false}
        style={{ flexDirection: "row", justifyContent: "center", gap: controller.metrics.gap }}
      >
        {controller.slots.map((digit, index) => (
          <OtpBox
            key={index}
            index={index}
            digit={digit}
            length={length}
            label={label}
            palette={palette}
            controller={controller}
            disabled={disabled}
            invalid={invalid}
            success={success}
            describedBy={describedBy}
            reducedMotion={reducedMotion}
          />
        ))}
      </View>
    </View>
  );
};

export default OtpCodeInput;
