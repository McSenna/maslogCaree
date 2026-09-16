import { FooterButtons } from "../CompletionChrome";
import type { CompletionStep } from "./useCompletionFlow";

type Options = {
  step: CompletionStep;
  saving: boolean;
  hasForm: boolean;
  onClose: () => void;
  onReview: () => void;
  onBackToForm: () => void;
  onConfirm: () => void;
};

export const buildCompletionFooter = ({
  step,
  saving,
  hasForm,
  onClose,
  onReview,
  onBackToForm,
  onConfirm,
}: Options) => {
  if (step === "form") {
    return (
      <FooterButtons
        backLabel="Cancel"
        onBack={onClose}
        nextLabel="Review & Complete"
        onNext={onReview}
        busy={saving}
        disabled={!hasForm}
      />
    );
  }

  if (step === "review") {
    return (
      <FooterButtons
        backLabel="Back to Form"
        onBack={onBackToForm}
        nextLabel={saving ? "Completing…" : "Complete Appointment"}
        onNext={onConfirm}
        busy={saving}
        disabled={false}
      />
    );
  }

  return undefined;
};
