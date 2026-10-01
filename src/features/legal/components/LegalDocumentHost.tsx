import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { useLegalDocumentUrl } from "../hooks/useLegalDocumentUrl";
import {
  closeLegalDocumentDialog,
  openLegalDocumentDialog,
  subscribeToLegalDocument,
} from "../services/legalDocumentStore";
import type { LegalDocumentKind } from "../types/legalDocument.types";
import LegalDocumentDialog from "./LegalDocumentDialog";

/** Mounted once at the root. Web only: the app opens /privacy and /terms as pages. */
const LegalDocumentHost = () => {
  const [kind, setKind] = useState<LegalDocumentKind | null>(null);

  useEffect(() => subscribeToLegalDocument(setKind), []);
  useLegalDocumentUrl(kind);

  if (Platform.OS !== "web") return null;

  return (
    <LegalDocumentDialog
      kind={kind}
      onClose={closeLegalDocumentDialog}
      onOpenRelated={openLegalDocumentDialog}
    />
  );
};

export default LegalDocumentHost;
