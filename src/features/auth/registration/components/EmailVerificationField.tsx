import { useEffect, useId, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { Platform, Text, View, type TextInput } from "react-native";

import { isValidEmailFormat } from "../emailVerificationConfig";
import type { useEmailVerification } from "../hooks/useEmailVerification";
import { REG_COLORS } from "../registrationTheme";
import EmailFieldControl from "./email/EmailFieldControl";
import { resolveEmailAction } from "./email/emailActionState";

type EmailVerificationFieldProps = {
  email: string;
  onChangeEmail: (value: string) => void;
  onBlurEmail: () => void;
  fieldError?: string;
  verification: ReturnType<typeof useEmailVerification>;
  height: number;
};

/**
 * Runs `focus` once the code dialog has finished closing. react-native-web moves
 * focus itself while a modal unmounts (restoring it, then re-trapping it in the
 * registration dialog), so wait a frame plus a task for that to settle first.
 */
const afterDialogCloses = (focus: () => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const frame = requestAnimationFrame(() => {
    timer = setTimeout(focus, 0);
  });
  return () => {
    cancelAnimationFrame(frame);
    if (timer) clearTimeout(timer);
  };
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
  const emailInputRef = useRef<TextInput>(null);
  const actionRef = useRef<View>(null);
  const emailLooksValid = isValidEmailFormat(email);
  const { isVerified, status } = verification;

  const codeSent = status === "codeSent";
  // Once a code is out, the code dialog reports its own errors (resend, verify).
  const message = fieldError || (codeSent || isVerified ? "" : verification.error);

  // "Change email" in the code dialog hands focus back to the address.
  useEffect(() => {
    if (!verification.emailFocusRequest) return;
    return afterDialogCloses(() => emailInputRef.current?.focus());
  }, [verification.emailFocusRequest]);

  // Dismissing the dialog returns focus to the control that reopens it (or to the
  // address once verified, since that button is then disabled). The dialog cannot
  // do this itself on web: the button that opened it was disabled while sending,
  // so the browser had already moved focus to the page body.
  useEffect(() => {
    if (Platform.OS !== "web" || !verification.returnFocusRequest) return;
    return afterDialogCloses(() =>
      isVerified ? emailInputRef.current?.focus() : actionRef.current?.focus()
    );
    // Only a new dismissal should move focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verification.returnFocusRequest]);

  const action = resolveEmailAction({
    isVerified,
    isSending: verification.isSending,
    codeSent,
    emailLooksValid,
  });

  const handleActionPress = () => {
    if (codeSent) {
      verification.openCodeDialog();
      return;
    }
    if (!emailLooksValid) {
      onBlurEmail();
      return;
    }
    void verification.sendCode();
  };

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
        inputRef={emailInputRef}
        actionRef={actionRef}
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
      ) : isVerified ? (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Feather name="check-circle" size={13} color={REG_COLORS.successText} />
          <Text style={{ fontSize: 12.5, lineHeight: 17, color: REG_COLORS.successText }}>
            Email verified.
          </Text>
        </View>
      ) : (
        <Text style={{ fontSize: 12.5, lineHeight: 17, color: REG_COLORS.muted }}>
          {codeSent
            ? "We sent a code to this address. Select Enter code to finish verifying."
            : "We'll send a verification code to this address."}
        </Text>
      )}
    </View>
  );
};

export default EmailVerificationField;
