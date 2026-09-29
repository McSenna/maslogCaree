import { View } from "react-native";

import ScreenScroll from "@/components/layout/ScreenScroll";
import { usePageMaxWidth } from "@/hooks/useResponsive";

import LegalDocumentView from "../components/LegalDocumentView";
import LegalLinks from "../components/LegalLinks";
import { LEGAL_DOCUMENTS } from "../legalContent";

/** `/privacy` and `/terms`: one readable column, with a link across to the other document. */
const LegalDocumentScreen = ({ kind }: { kind: keyof typeof LEGAL_DOCUMENTS }) => {
  const maxWidth = usePageMaxWidth("reading");

  return (
    <ScreenScroll contentContainerStyle={{ width: "100%", maxWidth, alignSelf: "center", paddingBottom: 40 }}>
      <View style={{ gap: 36 }}>
        <LegalDocumentView document={LEGAL_DOCUMENTS[kind]} />
        <LegalLinks align="left" />
      </View>
    </ScreenScroll>
  );
};

export default LegalDocumentScreen;
