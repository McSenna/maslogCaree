import type { MouseEvent } from "react";

import { LEGAL_ROUTES } from "@/features/legal/legalContent";
import type { LegalDocumentKind } from "@/features/legal/legalDocumentStore";
import { showLegalDocument } from "@/features/legal/showLegalDocument";
import s from "./webLogin.module.css";

const LINKS: { kind: LegalDocumentKind; label: string }[] = [
  { kind: "privacy", label: "Privacy policy" },
  { kind: "terms", label: "Terms and conditions" },
];

// A plain click opens the dialog over the form; modified clicks (new tab, new window) keep the real link.
const openInPlace = (kind: LegalDocumentKind) => (event: MouseEvent<HTMLAnchorElement>) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  showLegalDocument(kind);
};

const WebLoginLegalLinks = () => (
  <p className={s.legal}>
    {LINKS.map(({ kind, label }) => (
      <a key={kind} href={LEGAL_ROUTES[kind]} aria-haspopup="dialog" onClick={openInPlace(kind)}>
        {label}
      </a>
    ))}
  </p>
);

export default WebLoginLegalLinks;
