import { useEffect, useId, useRef } from "react";
import { AccessibilityInfo, Platform, Text, View } from "react-native";

import OtpCodeInput from "@/components/ui/OtpCodeInput";
import { isOtpComplete } from "@/components/ui/otpEntry";
import { useReducedMotion } from "@/theme/motion";

import { OTP_LENGTH } from "../../emailVerificationConfig";
import type { useEmailVerification } from "../../hooks/useEmailVerification";
import { REG_COLORS } from "../../registrationTheme";
import { maskEmail } from "./verificationCopy";
import { LinkButton, PrimaryButton } from "./VerificationButtons";
import ResendControl from "./ResendControl";
import VerificationIconBadge from "./VerificationIconBadge";
import VerificationStatusLine from "./VerificationStatusLine";
import VerifiedState from "./VerifiedState";
import { OTP_PALETTE } from "./verificationTheme";

type VerificationCodeBlockProps = {
  email: string;
  verification: ReturnType<typeof useEmailVerification>;
  onChangeEmail: () => void;
  /** Closes the dialog from the success screen. */
  onDone: () => void;
  buttonHeight: number;
  /** nativeID for the heading, so the dialog can name itself after it. */
  titleId: string;
};

const VerificationCodeBlock = ({
  email,
  verification,
  onChangeEmail,
  onDone,
  buttonHeight,
  titleId,
}: VerificationCodeBlockProps) => {
  const statusId = useId();
  const reducedMotion = useReducedMotion();
  const lastSubmitted = useRef("");
  const continueRef = useRef<View>(null);

  const { code, feedback, isVerifying, isVerified, isResending, expiresInMinutes } = verification;
  // Red boxes mean "the digits are the problem"; a dropped connection is not,
  // and expired or locked codes are cleared, so only these two mark the boxes.
  const invalid = feedback?.kind === "incorrect" || feedback?.kind === "incomplete";
  const busy = isVerifying || isResending;

  // iOS has no live regions, so status changes are announced explicitly.
  useEffect(() => {
    if (Platform.OS === "ios" && feedback?.message) {
      AccessibilityInfo.announceForAccessibility(feedback.message);
    }
  }, [feedback]);

  // The boxes disappear on success; put focus on Continue so keyboard users land
  // on the next action instead of the page body.
  useEffect(() => {
    if (!isVerified || Platform.OS !== "web") return;
    const frame = requestAnimationFrame(() => continueRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [isVerified]);

  const submit = (candidate: string) => {
    lastSubmitted.current = candidate;
    void verification.verifyCode(candidate);
  };

  const handleChange = (next: string) => {
    verification.setCode(next);
    if (!next) lastSubmitted.current = "";
    // Finishing the code submits it, but never the same code twice in a row, so
    // an incorrect code is not re-sent until the user actually changes a digit.
    if (isOtpComplete(next, OTP_LENGTH) && next !== lastSubmitted.current && !busy) {
      submit(next);
    }
  };

  if (isVerified) {
    return (
      <VerifiedState
        email={email}
        titleId={titleId}
        buttonHeight={buttonHeight}
        reducedMotion={reducedMotion}
        continueRef={continueRef}
        onDone={onDone}
      />
    );
  }

  const hint = `${
    expiresInMinutes ? `Expires in ${expiresInMinutes} minutes. ` : ""
  }Not there? Check your spam folder.`;

  return (
    <View style={{ width: "100%", gap: 18 }}>
      <View style={{ alignItems: "center", gap: 8 }}>
        <VerificationIconBadge name="mail" color={REG_COLORS.primary} background={REG_COLORS.primarySoft} />
        <Text
          nativeID={titleId}
          accessibilityRole="header"
          style={{ fontSize: 19, fontWeight: "700", color: REG_COLORS.heading, textAlign: "center" }}
        >
          Verify your email
        </Text>
        <Text style={{ fontSize: 14, lineHeight: 20, color: REG_COLORS.muted, textAlign: "center" }}>
          Enter the {OTP_LENGTH}-digit code we sent to{" "}
          <Text style={{ fontWeight: "600", color: REG_COLORS.text }}>{maskEmail(email)}</Text>.
        </Text>
      </View>

      <OtpCodeInput
        value={code}
        onChange={handleChange}
        onSubmit={submit}
        palette={OTP_PALETTE}
        length={OTP_LENGTH}
        disabled={busy}
        invalid={invalid}
        label="Verification code"
        describedBy={statusId}
        focusRequest={verification.focusRequest}
        reducedMotion={reducedMotion}
      />

      <VerificationStatusLine statusId={statusId} feedback={feedback} hint={hint} />

      <PrimaryButton
        label="Verify code"
        busyLabel="Verifying…"
        busy={isVerifying}
        onPress={() => submit(code)}
        height={buttonHeight}
        reducedMotion={reducedMotion}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          columnGap: 8,
        }}
      >
        <ResendControl verification={verification} />
        <LinkButton label="Change email" icon="edit-2" onPress={onChangeEmail} />
      </View>
    </View>
  );
};

export default VerificationCodeBlock;
