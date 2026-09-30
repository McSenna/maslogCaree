import { router, type Href } from "expo-router";
import { Platform } from "react-native";

import { LEGAL_ROUTES } from "./legalContent";
import { openLegalDocumentDialog, type LegalDocumentKind } from "./legalDocumentStore";

/**
 * Web opens the document in a centred dialog over the current screen, so a
 * half-filled login form survives; the app keeps its full-screen legal pages.
 */
export const showLegalDocument = (kind: LegalDocumentKind): void => {
  if (Platform.OS === "web") {
    openLegalDocumentDialog(kind);
    return;
  }
  router.push(LEGAL_ROUTES[kind] as Href);
};
