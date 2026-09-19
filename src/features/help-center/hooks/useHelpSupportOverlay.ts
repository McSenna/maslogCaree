import { useCallback, useState } from "react";

export type HelpSupportOverlayKey =
  | "helpCenter"
  | "contactSupport"
  | "supportRequests"
  | "privacySecurity";

export const useHelpSupportOverlay = () => {
  const [stack, setStack] = useState<HelpSupportOverlayKey[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [submissionShown, setSubmissionShown] = useState(false);

  const activeKey = stack.length > 0 ? stack[stack.length - 1] : null;
  const previousKey = stack.length > 1 ? stack[stack.length - 2] : null;

  const open = useCallback((key: HelpSupportOverlayKey) => {
    setActiveTicketId(null);
    setSubmissionShown(false);
    setStack((current) => (current.length === 0 ? [key] : [...current, key]));
  }, []);

  const close = useCallback(() => {
    setStack([]);
    setActiveTicketId(null);
    setSubmissionShown(false);
  }, []);

  const backToList = useCallback(() => setActiveTicketId(null), []);

  const openTicketDetails = useCallback((ticketId: string) => {
    setSubmissionShown(false);
    setStack(["supportRequests"]);
    setActiveTicketId(ticketId);
  }, []);

  /**
   * Android back and Escape reach this before the sheet animates away, so a
   * nested ticket or a stacked overlay is unwound instead of the sheet closing.
   */
  const handleDismissRequest = useCallback(() => {
    if (activeTicketId) {
      setActiveTicketId(null);
      return true;
    }
    if (stack.length > 1) {
      setSubmissionShown(false);
      setStack((current) => current.slice(0, -1));
      return true;
    }
    return false;
  }, [activeTicketId, stack.length]);

  return {
    activeKey,
    previousKey,
    activeTicketId,
    submissionShown,
    canGoBack: Boolean(activeTicketId) || stack.length > 1,
    open,
    close,
    goBack: handleDismissRequest,
    openTicket: setActiveTicketId,
    openTicketDetails,
    backToList,
    openSupportRequests: () => open("supportRequests"),
    openContactSupport: () => open("contactSupport"),
    setSubmissionShown,
    handleDismissRequest,
  };
};

export type HelpSupportOverlayState = ReturnType<typeof useHelpSupportOverlay>;
