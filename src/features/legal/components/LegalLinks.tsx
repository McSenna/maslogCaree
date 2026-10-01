import { View } from "react-native";

import { LEGAL_CATALOG, LEGAL_KINDS } from "../constants/legalCatalog";
import { useLegalColors } from "../hooks/useLegalColors";
import { showLegalDocument } from "../services/showLegalDocument";
import type { LegalDocumentKind } from "../types/legalDocument.types";
import LegalLink from "./LegalLink";

type LegalLinksProps = {
  /** Overrides navigation, e.g. to open the document in a dialog over a form. */
  onOpen?: (kind: LegalDocumentKind) => void;
  align?: "left" | "center";
  color?: string;
};

/**
 * The two legal links, for footers and forms. Every place they appear is on
 * a light public surface, so they use the public (light) colors.
 */
const LegalLinks = ({ onOpen, align = "center", color }: LegalLinksProps) => {
  const colors = useLegalColors("public");
  const open = onOpen ?? showLegalDocument;

  return (
    <View className={`flex-row flex-wrap gap-x-4 gap-y-2 ${align === "center" ? "justify-center" : "justify-start"}`}>
      {LEGAL_KINDS.map((kind) => (
        <LegalLink
          key={kind}
          label={LEGAL_CATALOG[kind].title}
          color={color ?? colors.primary}
          focusRing={colors.focusRing}
          onPress={() => open(kind)}
        />
      ))}
    </View>
  );
};

export default LegalLinks;
