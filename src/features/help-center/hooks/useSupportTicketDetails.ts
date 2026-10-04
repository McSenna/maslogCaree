import { useCallback, useState } from "react";

import { useRealtimeItem } from "@/hooks/realtime/useRealtimeItem";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { fetchMySupportTicket, replyToSupportTicket } from "../services/supportService";
import type { SupportTicket } from "../types/support.types";

const asTicket = (ticket: SupportTicket) => ticket;

/** One of the user's own tickets. Staff replies and status changes appear while it is open. */
export const useSupportTicketDetails = (ticketId: string | null) => {
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const { item, loading, error, mutate } = useRealtimeItem("supportTicket", ticketId, fetchMySupportTicket, {
    toItem: asTicket,
  });

  const sendReply = useCallback(
    async (body: string) => {
      if (!ticketId || sending) return false;

      setSending(true);
      setSendError(null);

      try {
        const message = await replyToSupportTicket(ticketId, body);
        mutate((ticket) =>
          ticket.messages.some((existing) => existing.id === message.id)
            ? ticket
            : { ...ticket, messages: [...ticket.messages, message] }
        );
        return true;
      } catch (caught: unknown) {
        setSendError(getApiErrorMessage(caught));
        return false;
      } finally {
        setSending(false);
      }
    },
    [ticketId, sending, mutate]
  );

  return { ticket: item, loading, sending, error: sendError ?? error, sendReply };
};
