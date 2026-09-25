import type { SupportTicketPage } from "../types/support.types";

export const toTicketPage = (data: Partial<SupportTicketPage> | null | undefined, page: number): SupportTicketPage => {
  const tickets = Array.isArray(data?.tickets) ? data.tickets : [];
  return {
    tickets,
    total: typeof data?.total === "number" ? data.total : tickets.length,
    page: typeof data?.page === "number" ? data.page : page,
    hasMore: data?.hasMore === true,
    statusCounts: data?.statusCounts,
  };
};
