import api from "@/services/api";
import type {
  SupportAttachmentDraft,
  SupportContactInfo,
  SupportFormValues,
  SupportMessage,
  SupportTicket,
  SupportTicketPage,
} from "../types/support.types";
import { toTicketPage } from "./ticketPage";

type TicketResponse = { success: boolean; ticket: SupportTicket };
type MessageResponse = { success: boolean; message: SupportMessage };
type OptionsResponse = { success: boolean; contact: SupportContactInfo };

const toAttachmentPayload = (attachments: SupportAttachmentDraft[]) =>
  attachments.map(({ fileName, mimeType, fileSize, data }) => ({
    fileName,
    mimeType,
    fileSize,
    data,
  }));

export const fetchSupportContact = async (): Promise<SupportContactInfo> => {
  const { data } = await api.get<OptionsResponse>("/support/options");
  return data.contact;
};

export const submitSupportTicket = async (
  values: SupportFormValues,
  attachments: SupportAttachmentDraft[]
): Promise<SupportTicket> => {
  const { data } = await api.post<TicketResponse>("/support/tickets", {
    category: values.category,
    subject: values.subject.trim(),
    description: values.description.trim(),
    contactNumber: values.contactNumber.trim(),
    attachments: toAttachmentPayload(attachments),
  });

  return data.ticket;
};

export const fetchMySupportTickets = async (
  page = 1,
  limit?: number
): Promise<SupportTicketPage> => {
  const { data } = await api.get<Partial<SupportTicketPage>>("/support/tickets/my", {
    params: { page, ...(limit ? { limit } : null) },
  });

  return toTicketPage(data, page);
};

export const fetchMySupportTicket = async (ticketId: string): Promise<SupportTicket> => {
  const { data } = await api.get<TicketResponse>(`/support/tickets/${ticketId}`);
  return data.ticket;
};

export const replyToSupportTicket = async (
  ticketId: string,
  body: string
): Promise<SupportMessage> => {
  const { data } = await api.post<MessageResponse>(`/support/tickets/${ticketId}/messages`, {
    body: body.trim(),
  });

  return data.message;
};
