import { Platform } from "react-native";

import Button from "@/components/buttons/Button";
import { DialogModalShell } from "@/components/ui/dialog/DialogShells";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";

import { LEGAL_DOCUMENTS } from "../legalContent";
import LegalDocumentView from "./LegalDocumentView";

type LegalDocumentDialogProps = {
  kind: keyof typeof LEGAL_DOCUMENTS | null;
  onClose: () => void;
};

// Web keeps the centred modal at every width; a bottom sheet in a narrow browser
// window reads as a broken page. The app still uses a sheet on phones.
const Shell = Platform.OS === "web" ? DialogModalShell : ResponsiveDialog;

/**
 * The same document in a modal, for places like sign-up where leaving the
 * screen would lose the form, and for every legal link on web.
 */
const LegalDocumentDialog = ({ kind, onClose }: LegalDocumentDialogProps) => {
  if (!kind) return null;
  const document = LEGAL_DOCUMENTS[kind];

  return (
    <Shell
      visible
      title={document.title}
      icon={kind === "privacy" ? "shield" : "file-text"}
      maxWidth={680}
      onClose={onClose}
      footer={<Button label="Close" variant="secondary" fullWidth onPress={onClose} />}
    >
      <LegalDocumentView document={document} showTitle={false} />
    </Shell>
  );
};

export default LegalDocumentDialog;
