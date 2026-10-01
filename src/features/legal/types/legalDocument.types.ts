/** Import-free so `node --test` can load the content that uses these types. */

export type LegalDocumentKind = "privacy" | "terms";

export type LegalBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  /** A fact the barangay still has to supply; rendered as a marked gap, never guessed. */
  | { kind: "missing"; label: string };

export type LegalSection = {
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  kind: LegalDocumentKind;
  title: string;
  /** The short lead under the title. */
  summary: string;
  sections: LegalSection[];
};
