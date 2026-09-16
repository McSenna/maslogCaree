import { useId } from "react";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { isValidEmailFormat } from "../emailVerificationConfig";
import type { useEmailVerification } from "../hooks/useEmailVerification";
import { REG_COLORS } from "../registrationTheme";
import EmailFieldControl from "./email/EmailFieldControl";
import VerificationCodeBlock from "./email/VerificationCodeBlock";
import { resolveEmailAction } from "./email/emailActionState";

type EmailVerificationFieldProps = {
  email: string;
  onChangeEmail: (value: string) => void;
  onBlurEmail: () => void;
  fieldError?: string;
  verification: ReturnType<typeof useEmailVerification>;
  height: number;
};

const EmailVerificationField = ({
  email,
  onChangeEmail,
  onBlurEmail,
  fieldError,
  verification,
  height,
}: EmailVerificationFieldProps) => {
  const labelId = useId();
  const emailLooksValid = isValidEmailFormat(email);
  const { isVerified, status } = verification;

  const codeSent = status === "codeSent";
  const message = fieldError || verification.error;

  const action = resolveEmailAction({
    isVerified,
    isSending: verification.isSending,
    codeSent,
    cooldown: verification.cooldown,
    emailLooksValid,
  });

  const handleActionPress = () => {
    if (!emailLooksValid) {
      onBlurEmail();
      return;
    }
    void verification.sendCode();
  };

  const helper = isVerified
    ? "Email successfully verified."
    : codeSent
      ? `We sent a verification code to ${email.trim()}.`
      : "We send your verification code here.";

  return (
    <View style={{ width: "100%", gap: 6 }}>
      <Text
        nativeID={labelId}
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: REG_COLORS.heading,
          letterSpacing: 0.1,
        }}
      >
        Email Address
        <Text style={{ color: REG_COLORS.error }}> *</Text>
      </Text>

      <EmailFieldControl
        value={email}
        onChangeText={onChangeEmail}
        onBlur={onBlurEmail}
        action={action}
        onActionPress={handleActionPress}
        invalid={Boolean(message)}
        editable={!verification.isVerifying}
        height={height}
        labelledBy={labelId}
      />

      {message ? (
        <View
          accessibilityRole="alert"
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}
        >
          <Feather
            name="alert-circle"
            size={13}
            color={REG_COLORS.error}
            style={{ marginTop: 1 }}
          />
          <Text style={{ flex: 1, fontSize: 12.5, lineHeight: 17, color: REG_COLORS.error }}>
            {message}
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontSize: 12.5,
            lineHeight: 17,
            color: isVerified ? REG_COLORS.success : REG_COLORS.muted,
          }}
        >
          {helper}
        </Text>
      )}

      {codeSent && !isVerified ? (
        <View style={{ marginTop: 6 }}>
          <VerificationCodeBlock
            code={verification.code}
            onChangeCode={verification.setCode}
            onVerify={(candidate) => void verification.verifyCode(candidate)}
            isVerifying={verification.isVerifying}
            hasError={Boolean(verification.error)}
            height={height}
          />
        </View>
      ) : null}
    </View>
  );
};

export default EmailVerificationField;
