import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

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
  const palette = useAdminSurfacePalette();

  if (loading) {
    return (
      <View style={{ paddingVertical: 40, alignItems: "center" }}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <View style={{ alignItems: "center", gap: 10, paddingVertical: 32 }}>
        <Text style={{ fontSize: 13.5, color: palette.negative, textAlign: "center" }}>{error}</Text>
        {onRetry ? (
          <Pressable
            onPress={onRetry}
            accessibilityRole="button"
            style={{
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: 18,
              borderRadius: RADIUS.control,
              backgroundColor: palette.primary,
            }}
          >
            <Text style={{ fontSize: 13.5, fontWeight: "700", color: "#FFFFFF" }}>Try again</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View style={{ alignItems: "center", gap: 12, paddingVertical: 32 }}>
        <Text style={{ fontSize: 15, fontWeight: "700", color: palette.heading }}>
          No support requests yet
        </Text>
        <Text style={{ fontSize: 13.5, color: palette.muted, textAlign: "center" }}>
          {emptyMessage}
        </Text>

        {emptyActionLabel && onEmptyAction ? (
          <Pressable
            onPress={onEmptyAction}
            accessibilityRole="button"
            style={{
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: 20,
              borderRadius: RADIUS.control,
              backgroundColor: palette.primary,
            }}
          >
            <Text style={{ fontSize: 13.5, fontWeight: "700", color: "#FFFFFF" }}>
              {emptyActionLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {tickets.map((ticket) => (
        <SupportTicketCard
          key={ticket.id}
          ticket={ticket}
          onPress={onOpenTicket}
          showRequester={showRequester}
        />
      ))}

      {hasMore && onLoadMore ? (
        <Pressable
          onPress={onLoadMore}
          disabled={loadingMore}
          accessibilityRole="button"
          style={{
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: RADIUS.control,
            borderWidth: 1,
            borderColor: palette.cardBorder,
            backgroundColor: palette.cardBg,
          }}
        >
          <Text style={{ fontSize: 13.5, fontWeight: "600", color: palette.body }}>
            {loadingMore ? "Loading..." : "Load more"}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default SupportTicketList;
