import { useMemo } from "react";

import { DataTable } from "@/components/data-table";

import type { SupportTicketSummary } from "../types/support.types";
import { supportColumns } from "./supportColumns";

type AdminSupportTableProps = {
  tickets: SupportTicketSummary[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  hasFilters: boolean;
  onPageChange: (page: number) => void;
  onOpenTicket: (ticketId: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
};

/** Support requests for admins. A click anywhere on a row opens it; Review is the same action for keyboards. */
const AdminSupportTable = ({
  tickets,
  loading,
  error,
  total,
  page,
  pageSize,
  hasFilters,
  onPageChange,
  onOpenTicket,
  onRetry,
  onClearFilters,
}: AdminSupportTableProps) => {
  const columns = useMemo(() => supportColumns(onOpenTicket), [onOpenTicket]);

  return (
    <DataTable
      caption="Support requests"
      columns={columns}
      data={tickets}
      rowKey={(ticket) => ticket.id}
      loading={loading && tickets.length === 0}
      refreshing={loading && tickets.length > 0}
      error={error}
      errorTitle="Unable to load support tickets."
      onRetry={onRetry}
      emptyIcon={hasFilters ? "filter" : "inbox"}
      emptyTitle={hasFilters ? "No matching support requests" : "No support requests"}
      emptyDescription={
        hasFilters
          ? "There are currently no support requests matching your search query or filters."
          : "Every support request has been handled. New requests will appear here."
      }
      emptyAction={hasFilters ? { label: "Reset filters", icon: "x", onPress: onClearFilters, variant: "outlined" } : undefined}
      onRowPress={(ticket) => onOpenTicket(ticket.id)}
      rowPressMode="pointer"
      pagination={{ page, pageSize, total, onPageChange, noun: "requests" }}
    />
  );
};

export default AdminSupportTable;
