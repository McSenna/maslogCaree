/**
 * Draft Privacy Policy and Terms and Conditions. Both describe only what the
 * code actually does (see backend/models and backend/services). Anything that
 * needs a decision from the barangay or a lawyer is a `missing` block rather
 * than a guess. Keep these files in step with the data model.
 */

import type { LegalDocument, LegalDocumentKind } from "../types/legalDocument.types.ts";
import { PRIVACY_POLICY } from "./privacyPolicy.ts";
import { TERMS_AND_CONDITIONS } from "./termsAndConditions.ts";

/** Shown at the top of both documents until the barangay approves them. */
export const LEGAL_DRAFT_NOTICE = {
  lead: "Draft for review.",
  body: "This page has not yet been approved by Barangay 61 Maslog or checked by a lawyer, and it may change before MaslogCare launches.",
} as const;

export const LEGAL_DOCUMENTS: Readonly<Record<LegalDocumentKind, LegalDocument>> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_AND_CONDITIONS,
};
