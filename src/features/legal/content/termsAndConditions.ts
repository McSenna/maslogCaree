import { LEGAL_CATALOG } from "../constants/legalCatalog.ts";
import type { LegalDocument } from "../types/legalDocument.types.ts";
import { list, missing, paragraph } from "./blocks.ts";

export const TERMS_AND_CONDITIONS: LegalDocument = {
  kind: "terms",
  title: LEGAL_CATALOG.terms.title,
  summary: "The rules for using MaslogCare to book and manage appointments at the Barangay 61 Maslog Health Center.",
  sections: [
    {
      id: "who",
      heading: "Who can use MaslogCare",
      blocks: [
        paragraph(
          "Resident accounts are for people who live in Barangay 61 Maslog. A new account stays pending until the health center checks the ID you submit. Staff accounts are for health center personnel only."
        ),
      ],
    },
    {
      id: "account",
      heading: "Your account",
      blocks: [
        list(
          "Give true and complete details, and keep them up to date.",
          "Keep your password to yourself. Sign out when you use a shared device, such as a tablet at the health center.",
          "Tell the health center if you think someone else has used your account."
        ),
      ],
    },
    {
      id: "appointments",
      heading: "Appointments",
      blocks: [
        list(
          // The triage queue can assign the time itself, so "a health worker" was too narrow.
          "A request joins the queue. The health center assigns the date and time, and the app tells you when that happens.",
          "Times can change when the schedule changes. You will see the new time in the app.",
          "If you cannot come, cancel or reschedule in the app, so the slot can go to someone else."
        ),
      ],
    },
    {
      id: "emergencies",
      heading: "Not for emergencies",
      blocks: [
        paragraph(
          "MaslogCare is not an emergency service. If you need urgent medical help, go to the nearest hospital or call your local emergency number."
        ),
      ],
    },
    {
      id: "use",
      heading: "Using MaslogCare fairly",
      blocks: [
        list(
          "Do not make requests in someone else's name without their permission.",
          "Do not try to see records that are not yours or get around the app's security.",
          "Do not upload files that are not related to your account or your care."
        ),
        paragraph("The health center may suspend an account that breaks these rules."),
      ],
    },
    {
      id: "availability",
      heading: "Availability and changes",
      blocks: [
        paragraph(
          "MaslogCare may be unavailable at times for maintenance or because of problems outside the health center's control. These terms may be updated; the app will show the new version."
        ),
        missing("Governing rules, effective date and the office responsible for these terms"),
      ],
    },
  ],
};
