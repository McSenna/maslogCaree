import ScreenScroll from "@/components/layout/ScreenScroll";
import { SPACING } from "@/theme/spacing";

import LegalDocumentView from "../components/LegalDocumentView";
import { LEGAL_MEASURE } from "../constants/legalLayout";
import { LEGAL_DOCUMENTS } from "../content";
import { showLegalDocument } from "../services/showLegalDocument";
import type { LegalDocumentKind } from "../types/legalDocument.types";

const CONTENT_STYLE = {
  width: "100%",
  maxWidth: LEGAL_MEASURE,
  alignSelf: "center",
  paddingBottom: SPACING.xxxl,
} as const;

/**
 * `/privacy` and `/terms` in the app: one readable column on the light public
 * layout, ending with a link across to the other document.
 */
const LegalDocumentScreen = ({ kind }: { kind: LegalDocumentKind }) => (
  <ScreenScroll contentContainerStyle={CONTENT_STYLE}>
    <LegalDocumentView document={LEGAL_DOCUMENTS[kind]} surface="public" onOpenRelated={showLegalDocument} />
  </ScreenScroll>
);

export default LegalDocumentScreen;
