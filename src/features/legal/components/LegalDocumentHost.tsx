import { useEffect, useState } from "react";
import { Platform } from "react-native";

import {
  closeLegalDocumentDialog,
  subscribeToLegalDocument,
  type LegalDocumentKind,
} from "../legalDocumentStore";
import { useLegalDocumentUrl } from "../useLegalDocumentUrl";
import LegalDocumentDialog from "./LegalDocumentDialog";

/** Mounted once at the root. Web only: the app opens /privacy and /terms as pages. */
const LegalDocumentHost = () => {
  const [kind, setKind] = useState<LegalDocumentKind | null>(null);

  useEffect(() => subscribeToLegalDocument(setKind), []);
  useLegalDocumentUrl(kind);

  if (Platform.OS !== "web") return null;

  return <LegalDocumentDialog kind={kind} onClose={closeLegalDocumentDialog} />;
};

export default LegalDocumentHost;
