import { router, type Href } from "expo-router";
import { Platform } from "react-native";

import { LEGAL_CATALOG } from "../constants/legalCatalog";
import type { LegalDocumentKind } from "../types/legalDocument.types";
import { openLegalDocumentDialog } from "./legalDocumentStore";

/**
 * Web opens the document in a centred dialog over the current screen, so a
 * half-filled login form survives; the app keeps its full-screen legal pages.
 */
export const showLegalDocument = (kind: LegalDocumentKind): void => {
  if (Platform.OS === "web") {
    openLegalDocumentDialog(kind);
    return;
  }
  router.push(LEGAL_CATALOG[kind].route as Href);
};
