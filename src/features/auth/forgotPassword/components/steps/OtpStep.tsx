import { Text, View } from "react-native";

import type { ForgotPasswordController } from "../../useForgotPassword";
import { OTP_LENGTH } from "../../recovery/otpConfig";
import { RECOVERY_COLORS as C } from "../../recoveryTheme";
import OtpInput from "../OtpInput";
import { PrimaryButton, RecoveryMessage, TextButton } from "../RecoveryControls";
import { StepHeading, StepIcon } from "./StepChrome";

const formatTimer = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

export const OtpStep = ({ flow }: { flow: ForgotPasswordController }) => (
  <View className="w-full items-center gap-5">
    <StepIcon icon="shield" />
    <StepHeading
      title="Enter Verification Code"
      subtitle="Enter the 6-digit verification code sent to your Gmail."
    />

    <OtpInput
      value={flow.otp}
      onChange={(next) => {
        flow.setOtp(next);
        if (flow.error) flow.setError(null);
      }}
      disabled={flow.isLoading}
      hasError={Boolean(flow.error)}
    />

    {flow.error ? <RecoveryMessage tone="error" text={flow.error} /> : null}
    {!flow.error && flow.notice ? <RecoveryMessage tone="info" text={flow.notice} /> : null}

    <View className="w-full gap-1">
      <PrimaryButton
        label="Verify Code"
        loadingLabel="Verifying..."
        loading={flow.isLoading}
        disabled={flow.otp.length !== OTP_LENGTH}
        onPress={() => void flow.verifyCode()}
      />

      <View className="w-full flex-row items-center justify-center gap-1">
        <Text className="text-[12.5px]" style={{ color: C.muted }}>
          Didn&apos;t receive the code?
        </Text>
        <TextButton
          label={flow.canResend ? "Resend Code" : `Resend in ${formatTimer(flow.resendTimer)}`}
          onPress={() => void flow.sendCode("resend")}
          disabled={!flow.canResend}
          tone="primary"
        />
      </View>

      <TextButton label="Change Email" icon="edit-2" onPress={flow.changeEmail} />
    </View>
  </View>
);
