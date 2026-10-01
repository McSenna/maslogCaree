import { LEGAL_CATALOG } from "../constants/legalCatalog.ts";
import type { LegalDocument } from "../types/legalDocument.types.ts";
import { list, missing, paragraph } from "./blocks.ts";

export const PRIVACY_POLICY: LegalDocument = {
  kind: "privacy",
  title: LEGAL_CATALOG.privacy.title,
  summary:
    "What MaslogCare collects, why, who can see it, and how to ask about your data. MaslogCare handles health information, which is sensitive personal information under the Data Privacy Act of 2012 (Republic Act No. 10173).",
  sections: [
    {
      id: "who",
      heading: "Who runs MaslogCare",
      blocks: [
        paragraph(
          "MaslogCare is the appointment and health record system of the Barangay 61 Maslog Health Center in Legazpi City. Residents use it to book and follow their visits. Health workers and administrators use it to run the queue, record care and manage accounts."
        ),
        missing("Name of the personal information controller and its data protection officer"),
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      blocks: [
        paragraph("When you create an account:"),
        list(
          "Your name (first, middle, last and suffix), civil status, gender and date of birth",
          "Your email address, mobile number and home address",
          "A password, which is stored only in scrambled (hashed) form",
          "A profile photo, if you choose to add one"
        ),
        paragraph("To confirm that you live in the barangay:"),
        list("The type and number of the ID you submit, and a photo or scan of that ID"),
        paragraph("When you book or attend an appointment:"),
        list(
          "The service you ask for, the concern you describe and any notes you add",
          "The date and time a health worker assigns, and each change of status",
          "What the health worker records at the visit, such as assessment, findings, diagnosis, recommendations, vital signs, immunization or prenatal details, medicines given and follow-up dates"
        ),
        paragraph("When you contact support:"),
        list("Your message, any files you attach, and the email address and number you give for replies"),
        paragraph("To keep accounts secure:"),
        list("A record of sign-ins and account changes, with the IP address and browser or device used"),
      ],
    },
    {
      id: "use",
      heading: "How we use it",
      blocks: [
        list(
          "To check that an account belongs to a resident of Barangay 61 Maslog",
          // backend/utils/priorityQueue.js: ageToTier orders the queue by age.
          "To place appointment requests in the queue and assign times. Your age, from your date of birth, sets your place in line: children under 2 first, then people aged 60 and over, then children aged 2 to 12, then teenagers.",
          "To keep a record of the care you receive so health workers can follow up",
          // backend/services/mailer/senders: otp, welcome, passwordReset, appointment.
          "To send you in-app notifications, and emails with verification codes, a welcome message, password reset codes, notices when your password changes, and appointment updates",
          "To find and stop misuse of accounts"
        ),
        paragraph("MaslogCare does not sell your data and does not use it for advertising."),
      ],
    },
    {
      id: "access",
      heading: "Who can see it",
      blocks: [
        list(
          "You can see your own account, appointments and medical records.",
          "Health workers (doctor, midwife and barangay health workers) see the appointments and records their role needs.",
          "Administrators manage accounts, review ID submissions and read the security log."
        ),
        paragraph("These limits are checked by the MaslogCare server on every request, not only by the app."),
      ],
    },
    {
      id: "storage",
      heading: "Where it is kept and for how long",
      blocks: [
        paragraph(
          "Your data is kept in the MaslogCare database. Uploaded IDs and attachments are stored on the MaslogCare server in a folder only the server can read."
        ),
        missing(
          "The outside services that host the database or send email for MaslogCare, and the countries where they keep data"
        ),
        missing("How long each kind of record is kept, and when it is deleted"),
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        paragraph("Under the Data Privacy Act of 2012 you have the right to:"),
        list(
          "Be informed about how your data is used",
          "Access your data",
          "Have mistakes in your data corrected",
          "Object to the processing of your data",
          "Ask for your data to be blocked or erased",
          "Receive a copy of your data",
          "File a complaint with the National Privacy Commission"
        ),
      ],
    },
    {
      id: "contact",
      heading: "How to reach us about your data",
      blocks: [
        paragraph("To ask for a copy of your data, a correction or anything else in this policy, contact:"),
        missing("Office, email address and phone number for data requests"),
        paragraph("You can also send a request from Help Center, then Contact Support, inside the app."),
      ],
    },
  ],
};
