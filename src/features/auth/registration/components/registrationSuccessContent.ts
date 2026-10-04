import type { Feather } from "@expo/vector-icons";

import type { RegistrationStatus } from "@/services/auth";
import { PALETTE } from "@/theme/palette";

type SuccessContent = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  badge: string;
  body: string;
  note: string;
  action: string;
  tone: { well: string; wellBorder: string; icon: string; badgeBg: string; badgeBorder: string; text: string };
};

// Pending uses the amber status tone and verified the teal one, matching the
// app's status colors. Neither variant mentions the master list: residents only
// learn whether their account can be used yet.
export const REGISTRATION_SUCCESS_CONTENT: Record<RegistrationStatus, SuccessContent> = {
  pending: {
    icon: "clock",
    title: "Registration submitted",
    badge: "Status: Pending verification",
    body: "Your registration has been successfully submitted. Your account is currently pending verification by the Barangay Administrator.",
    note: "You will be able to access MaslogCare once your account has been reviewed and approved.",
    action: "Back to login",
    tone: {
      well: PALETTE.amber[100],
      wellBorder: PALETTE.amber[300],
      icon: PALETTE.amber[600],
      badgeBg: PALETTE.amber[50],
      badgeBorder: PALETTE.amber[300],
      text: PALETTE.amber[700],
    },
  },
  approved: {
    icon: "check-circle",
    title: "Account verified",
    badge: "Status: Verified",
    body: "Your registration is complete and your account is verified. You can now log in to MaslogCare.",
    note: "Log in with the email address and password you just created.",
    action: "Log in now",
    tone: {
      well: PALETTE.green[50],
      wellBorder: PALETTE.green[200],
      icon: PALETTE.green[700],
      badgeBg: PALETTE.green[50],
      badgeBorder: PALETTE.green[200],
      text: PALETTE.green[700],
    },
  },
};
