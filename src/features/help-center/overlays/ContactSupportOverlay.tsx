import { useCallback, useState } from "react";

import SupportForm from "../support/SupportForm";
import SupportFormActions from "../support/SupportFormActions";
import SupportSubmittedState from "../support/SupportSubmittedState";
import { useSupportForm } from "../hooks/useSupportForm";
import ResponsiveSupportOverlay from "./ResponsiveSupportOverlay";
import type { SupportTicket } from "../types/support.types";

type ContactSupportOverlayProps = {
  onClose: () => void;
  onViewRequests: () => void;
  onSubmittedChange?: (submitted: boolean) => void;
  onDismissRequest?: () => boolean;
};

const ContactSupportOverlay = ({
  onClose,
  onViewRequests,
  onSubmittedChange,
  onDismissRequest,
}: ContactSupportOverlayProps) => {
  const [submitted, setSubmitted] = useState<SupportTicket | null>(null);

  const handleSubmitted = useCallback(
    (ticket: SupportTicket) => {
      setSubmitted(ticket);
      onSubmittedChange?.(true);
    },
    [onSubmittedChange]
  );

  const form = useSupportForm(handleSubmitted);

  const clear = useCallback(() => {
    setSubmitted(null);
    onSubmittedChange?.(false);
    form.reset();
  }, [form, onSubmittedChange]);

  const handleClose = useCallback(() => {
    if (form.submitting) return;
    clear();
    onClose();
  }, [form.submitting, clear, onClose]);

  const handleViewRequests = useCallback(() => {
    clear();
    onViewRequests();
  }, [clear, onViewRequests]);

  return (
    <ResponsiveSupportOverlay
      open
      title={submitted ? "Request Submitted" : "Contact Support"}
      icon={submitted ? "check-circle" : "headphones"}
      size="form"
      onClose={handleClose}
      onDismissRequest={onDismissRequest}
      footer={
        submitted ? undefined : <SupportFormActions form={form} onCancel={handleClose} />
      }
    >
      {submitted ? (
        <SupportSubmittedState
          ticket={submitted}
          onViewRequests={handleViewRequests}
          onClose={handleClose}
        />
      ) : (
        <SupportForm form={form} />
      )}
    </ResponsiveSupportOverlay>
  );
};

export default ContactSupportOverlay;
