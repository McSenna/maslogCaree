import type { HelpCategory } from "../../types/helpCenter.types";

export const PRIVACY_CATEGORY: HelpCategory = {
  id: "privacy",
  title: "Privacy & Security",
  description: "Learn how MaslogCare protects your personal and healthcare information.",
  icon: "shield",
  tone: "blue",
  articles: [
    {
      id: "identity-verification",
      title: "Identity verification",
      summary:
        "Residents verify their identity with a government-issued ID so health records stay linked to the right person.",
      keywords: ["identity", "verification", "verify"],
    },
    {
      id: "accepted-ids",
      title: "Accepted valid IDs",
      summary:
        "PhilSys, driver's licence, passport, UMID, postal ID, and other government-issued IDs are accepted.",
      keywords: ["id", "valid id", "accepted", "philsys", "passport", "umid"],
    },
    {
      id: "password-security",
      title: "Password security",
      summary:
        "Use a password that is not reused elsewhere, and change it immediately if you suspect it is known.",
      keywords: ["password", "secure", "strong"],
    },
    {
      id: "authentication-security",
      title: "Authentication security",
      summary: "Sessions expire automatically and every request is checked against your account.",
      keywords: ["authentication", "session", "token", "expired"],
    },
    {
      id: "role-permissions",
      title: "Role permissions",
      summary:
        "Residents, BHWs, midwives, doctors, and administrators each see only the information their role allows.",
      keywords: ["role", "permission", "access", "authorization"],
    },
    {
      id: "personal-privacy",
      title: "Personal information privacy",
      summary: "Your personal details are used only to deliver health services through MaslogCare.",
      keywords: ["privacy", "personal", "data"],
    },
    {
      id: "medical-privacy",
      title: "Medical information privacy",
      summary: "Medical records are restricted to you and the health workers involved in your care.",
      keywords: ["medical", "privacy", "confidential"],
    },
    {
      id: "suspicious-activity",
      title: "Suspicious account activity",
      summary:
        "Change your password and report the activity through a Privacy or Security Concern support request.",
      keywords: ["suspicious", "hacked", "unauthorized", "activity"],
    },
    {
      id: "report-unauthorized-access",
      title: "Reporting unauthorised access",
      summary:
        "Contact support immediately so administrators can review account activity and secure your record.",
      keywords: ["report", "unauthorized", "breach", "access"],
    },
  ],
};
