import type { LegalBlock } from "../types/legalDocument.types.ts";

export const paragraph = (text: string): LegalBlock => ({ kind: "paragraph", text });

export const list = (...items: string[]): LegalBlock => ({ kind: "list", items });

export const missing = (label: string): LegalBlock => ({ kind: "missing", label });
