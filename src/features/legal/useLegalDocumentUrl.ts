import { useEffect, useRef } from "react";
import { Platform } from "react-native";

import { LEGAL_DOCUMENTS, LEGAL_ROUTES } from "./legalContent";
import { closeLegalDocumentDialog, type LegalDocumentKind } from "./legalDocumentStore";

const MARKER = "legalDocument";

const hasMarker = (state: unknown): boolean =>
  typeof state === "object" && state !== null && MARKER in state;

/**
 * Mirrors the open dialog in the address bar (/privacy, /terms) so the link can
 * be copied and the browser Back button closes the dialog instead of leaving the
 * site. The entry copies the router's own history state, so going back lands on
 * the router's current record and the screen underneath stays mounted.
 */
export const useLegalDocumentUrl = (kind: LegalDocumentKind | null) => {
  const pushed = useRef(false);
  const pageTitle = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    if (kind) {
      // The tab names the document while its URL is showing, like the direct-link page does.
      pageTitle.current ??= document.title;
      document.title = `${LEGAL_DOCUMENTS[kind].title} · MaslogCare`;

      const state = { ...(window.history.state ?? {}), [MARKER]: kind };
      if (pushed.current) {
        window.history.replaceState(state, "", LEGAL_ROUTES[kind]);
      } else {
        window.history.pushState(state, "", LEGAL_ROUTES[kind]);
        pushed.current = true;
      }
      return;
    }

    if (pageTitle.current !== null) {
      document.title = pageTitle.current;
      pageTitle.current = null;
    }

    // Closed from inside the dialog: drop the entry this hook added.
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    }
  }, [kind]);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    // Back (or Forward) moved off the dialog's entry: the browser already did the navigation.
    const onPopState = () => {
      if (!pushed.current || hasMarker(window.history.state)) return;
      pushed.current = false;
      closeLegalDocumentDialog();
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
};
