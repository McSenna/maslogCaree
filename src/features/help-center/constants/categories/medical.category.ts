import type { HelpCategory } from "../../types/helpCenter.types";

export const MEDICAL_CATEGORY: HelpCategory = {
  id: "medical",
  title: "Medical Information",
  description:
    "Understand the health and medical information available through your MaslogCare account.",
  icon: "activity",
  tone: "pink",
  articles: [
    {
      id: "medical-details",
      title: "Your medical details",
      summary:
        "Medical Records shows the information recorded by health workers during your consultations.",
      keywords: ["medical", "records", "details", "health"],
    },
    {
      id: "medical-history",
      title: "Medical history",
      summary: "Past consultations, findings, and dispensed medicines are kept in your history.",
      keywords: ["history", "past", "previous", "records"],
    },
    {
      id: "previous-appointments",
      title: "Previous appointments",
      summary: "Completed appointments stay available so you can review what was recorded.",
      keywords: ["previous", "completed", "past appointments"],
    },
    {
      id: "information-availability",
      title: "When health information appears",
      summary:
        "Medical information becomes visible only after a health worker completes and saves the record.",
      keywords: ["availability", "when", "not showing", "empty"],
    },
    {
      id: "missing-information",
      title: "Missing medical information",
      summary:
        "If a completed visit has no record, the health worker may still be finalising it. Contact support if it stays missing.",
      keywords: ["missing", "blank", "cannot see", "not there"],
    },
    {
      id: "incorrect-medical-information",
      title: "Reporting incorrect information",
      summary:
        "Send a support request under Medical Information Concern so staff can review and correct the entry.",
      keywords: ["incorrect", "wrong", "error", "correct", "report"],
    },
    {
      id: "information-access",
      title: "Who can access your information",
      summary:
        "Only you and the health workers involved in your care can view your medical information.",
      keywords: ["access", "permission", "who can see", "privacy"],
    },
  ],
};
