import { View } from "react-native";

import type { ThemeColors } from "@/theme/colors";

import { LEGAL_CATALOG, otherLegalDocument } from "../constants/legalCatalog";
import type { LegalDocumentKind } from "../types/legalDocument.types";
import LegalLink from "./LegalLink";

type Props = {
  kind: LegalDocumentKind;
  colors: ThemeColors;
  onOpen: (kind: LegalDocumentKind) => void;
};

/** Ends each document with the way to the other one, so neither is a dead end. */
const LegalRelatedDocument = ({ kind, colors, onOpen }: Props) => {
  const other = otherLegalDocument(kind);

  return (
    <View className="border-t pt-4" style={{ borderTopColor: colors.divider }}>
      <LegalLink
        standalone
        label={`Read the ${LEGAL_CATALOG[other].title.toLowerCase()}`}
        color={colors.primary}
        focusRing={colors.focusRing}
        onPress={() => onOpen(other)}
      />
    </View>
  );
};

export default LegalRelatedDocument;
