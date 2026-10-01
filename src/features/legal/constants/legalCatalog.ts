import type { LegalDocumentKind } from "../types/legalDocument.types.ts";

type LegalCatalogEntry = {
  /** The document title, also used for links, menus and the browser tab. */
  title: string;
  route: `/${LegalDocumentKind}`;
  /** One line for menus that list the documents. */
  description: string;
};

/**
 * The one place that names each legal document and where it lives, so links,
 * menus and dialogs cannot drift apart. Import-free for `node --test`.
 */
export const LEGAL_CATALOG: Readonly<Record<LegalDocumentKind, LegalCatalogEntry>> = {
  privacy: {
    title: "Privacy policy",
    route: "/privacy",
    description: "What MaslogCare collects and how to ask about your data.",
  },
  terms: {
    title: "Terms and conditions",
    route: "/terms",
    description: "The rules for using MaslogCare.",
  },
};

/** Display order wherever both documents are listed. */
export const LEGAL_KINDS: readonly LegalDocumentKind[] = ["privacy", "terms"];

export const otherLegalDocument = (kind: LegalDocumentKind): LegalDocumentKind =>
  kind === "privacy" ? "terms" : "privacy";
