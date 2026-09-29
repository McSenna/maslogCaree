/**
 * Draft Privacy Policy and Terms and Conditions. Both describe only what the
 * code actually does (see backend/models and backend/services). Anything that
 * needs a decision from the barangay or a lawyer is written as NOT_PROVIDED
 * rather than guessed. Keep this file in step with the data model.
 */

export type LegalBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  /** A fact the barangay still has to supply; rendered as a marked gap. */
  | { kind: "missing"; label: string };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  kind: "privacy" | "terms";
  title: string;
  /** Short line under the title. */
  summary: string;
  sections: LegalSection[];
};

export const LEGAL_DRAFT_NOTICE =
  "Draft for review. This page has not yet been approved by Barangay 61 Maslog or checked by a lawyer, and it may change before MaslogCare launches.";

const p = (text: string): LegalBlock => ({ kind: "paragraph", text });
const list = (...items: string[]): LegalBlock => ({ kind: "list", items });
const missing = (label: string): LegalBlock => ({ kind: "missing", label });

export const PRIVACY_POLICY: LegalDocument = {
  kind: "privacy",
  title: "Privacy policy",
  summary:
    "What MaslogCare collects, why, who can see it, and how to ask about your data. MaslogCare handles health information, which is sensitive personal information under the Data Privacy Act of 2012 (Republic Act No. 10173).",
  sections: [
    {
      id: "who",
      heading: "Who runs MaslogCare",
      blocks: [
        p(
          "MaslogCare is the appointment and health record system of the Barangay 61 Maslog Health Center in Legazpi City. Residents use it to book and follow their visits. Health workers and administrators use it to run the queue, record care and manage accounts."
        ),
        missing("Name of the personal information controller and its data protection officer"),
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      blocks: [
        p("When you create an account:"),
        list(
          "Your name (first, middle, last and suffix), civil status, gender and date of birth",
          "Your email address, mobile number and home address",
          "A password, which is stored only in scrambled (hashed) form",
          "A profile photo, if you choose to add one"
        ),
        p("To confirm that you live in the barangay:"),
        list("The type and number of the ID you submit, and a photo or scan of that ID"),
        p("When you book or attend an appointment:"),
        list(
          "The service you ask for, the concern you describe and any notes you add",
          "The date and time a health worker assigns, and each change of status",
          "What the health worker records at the visit, such as assessment, findings, diagnosis, recommendations, vital signs, immunization or prenatal details, medicines given and follow-up dates"
        ),
        p("When you contact support:"),
        list("Your message, any files you attach, and the email address and number you give for replies"),
        p("To keep accounts secure:"),
        list("A record of sign-ins and account changes, with the IP address and browser or device used"),
      ],
    },
    {
      id: "use",
      heading: "How we use it",
      blocks: [
        list(
          "To check that an account belongs to a resident of Barangay 61 Maslog",
          "To place appointment requests in the queue and assign times",
          "To keep a record of the care you receive so health workers can follow up",
          "To send you in-app notifications, and emails for verification codes, password resets and appointment updates",
          "To find and stop misuse of accounts"
        ),
        p("MaslogCare does not sell your data and does not use it for advertising."),
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
        p("These limits are checked by the MaslogCare server on every request, not only by the app."),
      ],
    },
    {
      id: "storage",
      heading: "Where it is kept and for how long",
      blocks: [
        p(
          "Your data is kept in the MaslogCare database. Uploaded IDs and attachments are stored on the MaslogCare server in a folder only the server can read."
        ),
        missing("How long each kind of record is kept, and when it is deleted"),
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        p(
          "Under the Data Privacy Act of 2012 you have the right to be informed about how your data is used, to access it, to have mistakes corrected, to object to its processing, to ask for it to be blocked or erased, to receive a copy of it, and to file a complaint with the National Privacy Commission."
        ),
      ],
    },
    {
      id: "contact",
      heading: "How to reach us about your data",
      blocks: [
        p("To ask for a copy of your data, a correction or anything else in this policy, contact:"),
        missing("Office, email address and phone number for data requests"),
        p("You can also send a request from Help center, then Contact support, inside the app."),
      ],
    },
  ],
};

export const TERMS_AND_CONDITIONS: LegalDocument = {
  kind: "terms",
  title: "Terms and conditions",
  summary: "The rules for using MaslogCare to book and manage appointments at the Barangay 61 Maslog Health Center.",
  sections: [
    {
      id: "who",
      heading: "Who can use MaslogCare",
      blocks: [
        p(
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
          "A request joins the queue. A health worker assigns the date and time, and the app tells you when that happens.",
          "Times can change when the schedule changes. You will see the new time in the app.",
          "Cancel from the app if you cannot come, so the slot can go to someone else."
        ),
      ],
    },
    {
      id: "emergencies",
      heading: "Not for emergencies",
      blocks: [
        p(
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
        p("The health center may suspend an account that breaks these rules."),
      ],
    },
    {
      id: "availability",
      heading: "Availability and changes",
      blocks: [
        p(
          "MaslogCare may be unavailable at times for maintenance or because of problems outside the health center's control. These terms may be updated; the app will show the new version."
        ),
        missing("Governing rules, effective date and the office responsible for these terms"),
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_AND_CONDITIONS,
} as const;

export const LEGAL_ROUTES = {
  privacy: "/privacy",
  terms: "/terms",
} as const;
