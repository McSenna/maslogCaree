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
  emailLooksValid: boolean;
};

export const resolveEmailAction = ({
  isVerified,
  isSending,
  codeSent,
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

  // Once a code is out, this reopens the code dialog (resending lives in the dialog).
  if (codeSent) {
    return {
      label: "Enter code",
      tone: "active",
      disabled: false,
      icon: "hash",
      accessibilityLabel: "Enter verification code",
    };
  }

  if (isSending) {
    return {
      label: "Sending",
      tone: "busy",
      disabled: true,
      accessibilityLabel: "Sending verification code",
    };
  }

  return {
    label: "Send code",
    tone: emailLooksValid ? "active" : "idle",
    disabled: !emailLooksValid,
    accessibilityLabel: "Send verification code",
  };
};
