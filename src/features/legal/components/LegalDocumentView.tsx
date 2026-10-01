import { Text, View } from "react-native";

import { TYPE } from "@/theme/typography";

import { useLegalColors, type LegalSurface } from "../hooks/useLegalColors";
import type { LegalDocument, LegalDocumentKind } from "../types/legalDocument.types";
import LegalDraftNotice from "./LegalDraftNotice";
import LegalRelatedDocument from "./LegalRelatedDocument";
import LegalSection from "./LegalSection";

type LegalDocumentViewProps = {
  document: LegalDocument;
  /** Public pages are light-only; dialogs follow the app theme. */
  surface: LegalSurface;
  /** Hides the big title when a dialog header already names the document. */
  showTitle?: boolean;
  /** Offers the other document at the end; left out where there is nowhere to go. */
  onOpenRelated?: (kind: LegalDocumentKind) => void;
};

/** The body of a legal document, shared by its page and its dialog. */
const LegalDocumentView = ({ document, surface, showTitle = true, onOpenRelated }: LegalDocumentViewProps) => {
  const colors = useLegalColors(surface);

  return (
    <View className="gap-8">
      <View className="gap-4">
        {showTitle ? (
          <Text role="heading" aria-level={1} style={[TYPE.display, { color: colors.heading }]}>
            {document.title}
          </Text>
        ) : null}
        <Text style={[TYPE.bodyLarge, { color: colors.muted }]}>{document.summary}</Text>
        <LegalDraftNotice colors={colors} />
      </View>

      {document.sections.map((section, index) => (
        <LegalSection key={section.id} section={section} number={index + 1} colors={colors} />
      ))}

      {onOpenRelated ? (
        <LegalRelatedDocument kind={document.kind} colors={colors} onOpen={onOpenRelated} />
      ) : null}
    </View>
  );
};

export default LegalDocumentView;
