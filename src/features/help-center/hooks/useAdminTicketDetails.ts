import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import {
  fetchAdminSupportTicket,
  replyAsAdmin,
  updateAdminTicketStatus,
} from "../services/adminSupportService";
import type { SupportStatus, SupportTicket } from "../types/support.types";

type LoadedTicket = { id: string; ticket: SupportTicket };

export const useAdminTicketDetails = (ticketId: string | null, onChanged?: () => void) => {
  const [loaded, setLoaded] = useState<LoadedTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    let active = true;

    void (async () => {
      setLoading(true);
      try {
        const result = await fetchAdminSupportTicket(ticketId);
        if (active) {
          setLoaded({ id: ticketId, ticket: result });
          setError(null);
        }
      } catch (caught: unknown) {
        if (active) setError(getApiErrorMessage(caught));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [ticketId]);

  const run = useCallback(
    async (
      action: (id: string) => Promise<void>,
      outcome: { success: string; failure: string }
    ) => {
      if (!ticketId || busy) return false;

      setBusy(true);
      setError(null);

      try {
        await action(ticketId);
        onChanged?.();
        toast.success(outcome.success);
        return true;
      } catch (caught: unknown) {
        const message = getApiErrorMessage(caught);
        setError(message);
        // The phone sheet has no error area, so the toast carries the reason too.
        toast.error(outcome.failure, message);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [ticketId, busy, onChanged]
  );

  const changeStatus = useCallback(
    (status: SupportStatus) =>
      run(async (id) => {
        const updated = await updateAdminTicketStatus(id, status);
        setLoaded({ id, ticket: updated });
      }, { success: "Ticket status updated", failure: "Status not changed" }),
    [run]
  );

  const sendReply = useCallback(
    (body: string) =>
      run(async (id) => {
        const message = await replyAsAdmin(id, body);
        setLoaded((current) =>
          current
            ? {
                ...current,
                ticket: { ...current.ticket, messages: [...current.ticket.messages, message] },
              }
            : current
        );
      }, { success: "Reply sent", failure: "Reply not sent" }),
    [run]
  );

  return {
    ticket: loaded?.id === ticketId ? loaded.ticket : null,
    loading,
    busy,
    error,
    changeStatus,
    sendReply,
  };
};
