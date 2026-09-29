import Button from "@/components/buttons/Button";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";

import { LEGAL_DOCUMENTS } from "../legalContent";
import LegalDocumentView from "./LegalDocumentView";

type LegalDocumentDialogProps = {
  kind: keyof typeof LEGAL_DOCUMENTS | null;
  onClose: () => void;
};

/**
 * The same document in a modal (tablet and up) or bottom sheet (phones), for
 * places like sign-up where leaving the screen would lose the form.
 */
const LegalDocumentDialog = ({ kind, onClose }: LegalDocumentDialogProps) => {
  if (!kind) return null;
  const document = LEGAL_DOCUMENTS[kind];

  return (
    <ResponsiveDialog
      visible
      title={document.title}
      icon={kind === "privacy" ? "shield" : "file-text"}
      maxWidth={680}
      onClose={onClose}
      footer={<Button label="Close" variant="secondary" fullWidth onPress={onClose} />}
    >
      <LegalDocumentView document={document} showTitle={false} />
    </ResponsiveDialog>
  );
};

export default LegalDocumentDialog;
