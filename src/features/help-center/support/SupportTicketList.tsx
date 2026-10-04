import { View } from "react-native";

import AnimatedListItem from "@/components/animations/AnimatedListItem";
import Button from "@/components/buttons/Button";
import ResponsiveGrid from "@/components/layout/ResponsiveGrid";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { SPACING } from "@/theme/spacing";

import SupportTicketCard from "./SupportTicketCard";
import type { SupportTicketSummary } from "../types/support.types";

type SupportTicketListProps = {
  tickets: SupportTicketSummary[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  emptyMessage: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  showRequester?: boolean;
  onOpenTicket: (ticketId: string) => void;
  onLoadMore?: () => void;
  onRetry?: () => void;
};

const SupportTicketList = ({
  tickets,
  loading,
  loadingMore,
  hasMore,
  error,
  emptyMessage,
  emptyActionLabel,
  onEmptyAction,
  showRequester = false,
  onOpenTicket,
  onLoadMore,
  onRetry,
}: SupportTicketListProps) => {
  if (loading) {
    return (
      <View style={{ gap: SPACING.md }} accessibilityLabel="Loading support requests">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-24 w-full rounded-lg" />
        ))}
      </View>
    );
  }

  if (error && tickets.length === 0) {
    return <ErrorState title="Unable to load support requests" message={error} onRetry={onRetry} compact />;
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon="life-buoy"
        title="No support requests yet"
        description={emptyMessage}
        compact
        action={emptyActionLabel && onEmptyAction ? { label: emptyActionLabel, onPress: onEmptyAction } : undefined}
      />
    );
  }

  return (
    <View style={{ gap: SPACING.md }}>
      {/* Two-up only when the list itself is wide (full-page on large screens); dialogs stay single. */}
      <ResponsiveGrid minColumnWidth={420} maxColumns={2} gap={SPACING.md} initialColumns={{ mobile: 1 }}>
        {tickets.map((ticket, index) => (
          <AnimatedListItem key={ticket.id} index={index} style={{ height: "100%" }}>
            <SupportTicketCard ticket={ticket} onPress={onOpenTicket} showRequester={showRequester} />
          </AnimatedListItem>
        ))}
      </ResponsiveGrid>

      {hasMore && onLoadMore ? (
        <Button
          variant="secondary"
          label="Load more"
          loadingLabel="Loading…"
          loading={loadingMore}
          fullWidth
          onPress={onLoadMore}
        />
      ) : null}
    </View>
  );
};

export default SupportTicketList;
