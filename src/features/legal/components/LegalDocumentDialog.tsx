import type { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";

import Button from "@/components/buttons/Button";
import { DialogModalShell } from "@/components/ui/dialog/DialogShells";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";

import { LEGAL_DIALOG_MAX_WIDTH } from "../constants/legalLayout";
import { LEGAL_DOCUMENTS } from "../content";
import type { LegalDocumentKind } from "../types/legalDocument.types";
import LegalDocumentView from "./LegalDocumentView";

type LegalDocumentDialogProps = {
  kind: LegalDocumentKind | null;
  onClose: () => void;
  /** Lets the reader switch to the other document without leaving the dialog. */
  onOpenRelated?: (kind: LegalDocumentKind) => void;
};

const ICONS: Record<LegalDocumentKind, keyof typeof Feather.glyphMap> = {
  privacy: "shield",
  terms: "file-text",
};

// Web keeps the centred modal at every width; a bottom sheet in a narrow browser
// window reads as a broken page. The app still uses a sheet on phones.
const Shell = Platform.OS === "web" ? DialogModalShell : ResponsiveDialog;

/**
 * The document in a modal, for places like sign-up where leaving the screen
 * would lose the form, and for every legal link on web.
 */
const LegalDocumentDialog = ({ kind, onClose, onOpenRelated }: LegalDocumentDialogProps) => {
  if (!kind) return null;
  const document = LEGAL_DOCUMENTS[kind];

  return (
    // Keyed by document: switching to the other one starts at its top, and
    // focus moves into the new dialog so screen readers announce it.
    <Shell
      key={kind}
      visible
      title={document.title}
      icon={ICONS[kind]}
      maxWidth={LEGAL_DIALOG_MAX_WIDTH}
      onClose={onClose}
      footer={
        <Button
          label="Close"
          accessibilityLabel={`Close ${document.title.toLowerCase()}`}
          variant="secondary"
          fullWidth
          onPress={onClose}
        />
      }
    >
      <LegalDocumentView document={document} surface="themed" showTitle={false} onOpenRelated={onOpenRelated} />
    </Shell>
  );
};

export default LegalDocumentDialog;
