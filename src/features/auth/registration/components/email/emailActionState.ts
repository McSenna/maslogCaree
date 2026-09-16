import type { Feather } from "@expo/vector-icons";

export type EmailActionTone = "idle" | "active" | "busy" | "verified";

export type EmailActionState = {
  label: string;
  tone: EmailActionTone;
  disabled: boolean;
  icon?: keyof typeof Feather.glyphMap;
  accessibilityLabel: string;
};

type Input = {
  isVerified: boolean;
  isSending: boolean;
  codeSent: boolean;
  cooldown: number;
  emailLooksValid: boolean;
};

export const resolveEmailAction = ({
  isVerified,
  isSending,
  codeSent,
  cooldown,
  emailLooksValid,
}: Input): EmailActionState => {
  if (isVerified) {
    return {
      label: "Verified",
      tone: "verified",
      disabled: true,
      icon: "check",
      accessibilityLabel: "Email verified",
    };
  }

  if (isSending) {
    return {
      label: codeSent ? "Resending" : "Sending",
      tone: "busy",
      disabled: true,
      accessibilityLabel: "Sending verification code",
    };
  }

  if (codeSent && cooldown > 0) {
    return {
      label: `Resend in ${cooldown}s`,
      tone: "idle",
      disabled: true,
      accessibilityLabel: `Resend available in ${cooldown} seconds`,
    };
  }

  if (codeSent) {
    return {
      label: "Resend code",
      tone: "active",
      disabled: false,
      accessibilityLabel: "Resend verification code",
    };
  }

  return {
    label: "Send code",
    tone: emailLooksValid ? "active" : "idle",
    disabled: !emailLooksValid,
    accessibilityLabel: "Send verification code",
  };
};
