// Admin-facing wording for the master list check shown in a User Request.
// Import-free on purpose so `node --test` can load it.
import type {
  MasterListOutcome,
  MasterListReason,
  MasterListReview,
} from "../../../services/userRequestTypes";

export type MasterListTone = "match" | "review" | "neutral";

export type MasterListIcon =
  | "check-circle"
  | "search"
  | "alert-triangle"
  | "copy"
  | "link"
  | "info"
  | "cloud-off";

export type OutcomeSummary = {
  tone: MasterListTone;
  icon: MasterListIcon;
  title: string;
  body: string;
};

const OUTCOME_SUMMARIES: Record<MasterListOutcome, OutcomeSummary> = {
  matched: {
    tone: "match",
    icon: "check-circle",
    title: "Matches one master list record",
    body: "Every checked detail agrees with one record. A match shows the resident is on the list, not who registered, so still check the ID.",
  },
  no_match: {
    tone: "neutral",
    icon: "search",
    title: "No master list record found",
    body: "No active record has this name and birth date. Check the details against the ID, or ask the resident to visit the barangay hall.",
  },
  partial_match: {
    tone: "review",
    icon: "alert-triangle",
    title: "Close to a record, but not exact",
    body: "A record is similar, but some details are missing or spelled differently. Compare them below.",
  },
  conflict: {
    tone: "review",
    icon: "alert-triangle",
    title: "A record matches, but some details disagree",
    body: "Compare the flagged details with the ID before you decide.",
  },
  multiple_matches: {
    tone: "review",
    icon: "copy",
    title: "More than one record could be this person",
    body: "MaslogCare does not choose between them. Compare each record with the ID.",
  },
  already_linked: {
    tone: "review",
    icon: "link",
    title: "This record already belongs to another account",
    body: "Another MaslogCare account is linked to the matching record. This may be a duplicate registration.",
  },
  insufficient_data: {
    tone: "neutral",
    icon: "info",
    title: "Not enough details to compare",
    body: "This registration has no full name, birth date or sex to check against the master list.",
  },
  unavailable: {
    tone: "neutral",
    icon: "cloud-off",
    title: "The master list check did not run",
    body: "The master list could not be reached during sign-up. Review the ID as usual.",
  },
};

const NOT_CHECKED: OutcomeSummary = {
  tone: "neutral",
  icon: "info",
  title: "Not checked against the master list",
  body: "This registration was submitted before master list checks began.",
};

const AUTO_VERIFIED: OutcomeSummary = {
  tone: "match",
  icon: "check-circle",
  title: "Verified automatically",
  body: "Every checked detail agreed with one master list record, so MaslogCare approved this account under the barangay's auto-verify policy.",
};

export const describeOutcome = (review?: MasterListReview | null): OutcomeSummary => {
  if (!review?.checked || !review.outcome) return NOT_CHECKED;
  if (review.verificationMethod === "master_list") return AUTO_VERIFIED;
  return OUTCOME_SUMMARIES[review.outcome];
};

export const REASON_LABELS: Record<MasterListReason, string> = {
  dob_differs: "Birth date differs",
  name_spelling_differs: "Name is spelled differently",
  middle_name_missing: "Middle name is blank on one side",
  middle_name_differs: "Middle name differs",
  suffix_differs: "Suffix differs",
  sex_differs: "Sex differs",
  address_missing: "No purok or street was given",
  address_differs: "Purok or street differs",
};
