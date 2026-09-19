import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { fetchMySupportTicket, replyToSupportTicket } from "../services/supportService";
import type { SupportMessage, SupportTicket } from "../types/support.types";

type LoadedTicket = { id: string; ticket: SupportTicket };

export const useSupportTicketDetails = (ticketId: string | null) => {
  const [loaded, setLoaded] = useState<LoadedTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    let active = true;

    void (async () => {
      setLoading(true);
      try {
        const result = await fetchMySupportTicket(ticketId);
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

  const appendMessage = useCallback((message: SupportMessage) => {
    setLoaded((current) =>
      current
        ? { ...current, ticket: { ...current.ticket, messages: [...current.ticket.messages, message] } }
        : current
    );
  }, []);

  const sendReply = useCallback(
    async (body: string) => {
      if (!ticketId || sending) return false;

      setSending(true);
      setError(null);

      try {
        appendMessage(await replyToSupportTicket(ticketId, body));
        return true;
      } catch (caught: unknown) {
        setError(getApiErrorMessage(caught));
        return false;
      } finally {
        setSending(false);
      }
    },
    [ticketId, sending, appendMessage]
  );

  return {
    ticket: loaded?.id === ticketId ? loaded.ticket : null,
    loading,
    sending,
    error,
    sendReply,
  };
};
