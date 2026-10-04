import { useCallback, useState } from "react";

import { toast } from "@/components/feedback/toast/toastStore";
import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import {
  fetchAdminSupportTicket,
  replyAsAdmin,
  updateAdminTicketStatus,
} from "../services/adminSupportService";
import type { SupportStatus, SupportTicket } from "../types/support.types";
import { toastError } from "@/utils/errorToast/toastError";

const asTicket = (ticket: SupportTicket) => ticket;

/** One ticket in the admin queue. A requester's reply, or another admin's action, appears while it is open. */
export const useAdminTicketDetails = (ticketId: string | null, onChanged?: () => void) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { item, loading, error: loadError, mutate } = useRealtimeItem(
    "adminSupportTicket",
    ticketId,
    fetchAdminSupportTicket,
    { toItem: asTicket }
  );

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
        toastError(outcome.failure, caught);
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
        mutate(() => updated);
      }, { success: "Ticket status updated", failure: "Status not changed" }),
    [run, mutate]
  );

  const sendReply = useCallback(
    (body: string) =>
      run(async (id) => {
        const message = await replyAsAdmin(id, body);
        mutate((ticket) =>
          ticket.messages.some((existing) => existing.id === message.id)
            ? ticket
            : { ...ticket, messages: [...ticket.messages, message] }
        );
      }, { success: "Reply sent", failure: "Reply not sent" }),
    [run, mutate]
  );

  return {
    ticket: item,
    loading,
    busy,
    error: error ?? loadError,
    changeStatus,
    sendReply,
  };
};
