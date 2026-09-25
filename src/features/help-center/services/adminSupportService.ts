import api from "@/services/api";
import type {
  SupportCategoryId,
  SupportMessage,
  SupportStatus,
  SupportTicket,
  SupportTicketPage,
} from "../types/support.types";
import { toTicketPage } from "./ticketPage";

export type AdminTicketQuery = {
  status?: SupportStatus | "all";
  category?: SupportCategoryId | "all";
  search?: string;
  sort?: "recent" | "oldest" | "created";
  page?: number;
};

type TicketResponse = { success: boolean; ticket: SupportTicket };
type MessageResponse = { success: boolean; message: SupportMessage };

const toParams = (query: AdminTicketQuery) => ({
  ...(query.status && query.status !== "all" ? { status: query.status } : null),
  ...(query.category && query.category !== "all" ? { category: query.category } : null),
  ...(query.search?.trim() ? { search: query.search.trim() } : null),
  ...(query.sort ? { sort: query.sort } : null),
  page: query.page ?? 1,
});

export const fetchAdminSupportTickets = async (
  query: AdminTicketQuery
): Promise<SupportTicketPage> => {
  const { data } = await api.get<Partial<SupportTicketPage>>("/admin/support/tickets", {
    params: toParams(query),
  });

  return toTicketPage(data, query.page ?? 1);
};

export const fetchAdminSupportTicket = async (ticketId: string): Promise<SupportTicket> => {
  const { data } = await api.get<TicketResponse>(`/admin/support/tickets/${ticketId}`);
  return data.ticket;
};

export const updateAdminTicketStatus = async (
  ticketId: string,
  status: SupportStatus
): Promise<SupportTicket> => {
  const { data } = await api.patch<TicketResponse>(`/admin/support/tickets/${ticketId}/status`, {
    status,
  });

  return data.ticket;
};

export const replyAsAdmin = async (ticketId: string, body: string): Promise<SupportMessage> => {
  const { data } = await api.post<MessageResponse>(`/admin/support/tickets/${ticketId}/messages`, {
    body: body.trim(),
  });

  return data.message;
};
