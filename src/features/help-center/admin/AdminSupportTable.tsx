import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import Pagination from "@/components/ui/Pagination";
import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import AdminSupportEmptyState from "./AdminSupportEmptyState";
import AdminSupportTableHeader from "./AdminSupportTableHeader";
import AdminSupportTableRow from "./AdminSupportTableRow";
import { SUPPORT_TABLE_MIN_WIDTH } from "./adminSupportTableColumns";
import type { SupportTicketSummary } from "../types/support.types";
import { PALETTE } from "@/theme/palette";

type AdminSupportTableProps = {
  tickets: SupportTicketSummary[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  hasFilters: boolean;
  onPageChange: (page: number) => void;
  onOpenTicket: (ticketId: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
};

const AdminSupportTable = ({
  tickets,
  loading,
  error,
  total,
  page,
  totalPages,
  pageSize,
  hasFilters,
  onPageChange,
  onOpenTicket,
  onRetry,
  onClearFilters,
}: AdminSupportTableProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        width: "100%",
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderWidth: 1,
        borderColor: palette.cardBorder,
        overflow: "hidden",
        ...CARD_SHADOW,
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: "100%", flexGrow: 1 }}
      >
        <View style={{ minWidth: SUPPORT_TABLE_MIN_WIDTH, width: "100%", flexGrow: 1 }}>
          <AdminSupportTableHeader />

          {loading && tickets.length === 0 ? (
            <View style={{ paddingVertical: 56, alignItems: "center", justifyContent: "center", gap: 12 }}>
              <ActivityIndicator size="small" color={palette.primary} />
              <Text style={{ fontSize: 13, color: palette.muted }}>Loading support tickets...</Text>
            </View>
          ) : error && tickets.length === 0 ? (
            <View style={{ paddingVertical: 48, alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: palette.negative }}>
                Unable to load support tickets
              </Text>
              <Text style={{ fontSize: 12.5, color: palette.muted }}>{error}</Text>
              <Pressable
                onPress={onRetry}
                accessibilityRole="button"
                accessibilityLabel="Retry loading support tickets"
                style={{
                  marginTop: 6,
                  minHeight: 36,
                  justifyContent: "center",
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: RADIUS.control,
                  backgroundColor: palette.primary,
                }}
              >
                <Text style={{ fontSize: 12.5, fontWeight: "600", color: PALETTE.white }}>Retry</Text>
              </Pressable>
            </View>
          ) : tickets.length === 0 ? (
            <AdminSupportEmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
          ) : (
            tickets.map((ticket, index) => (
              <AdminSupportTableRow
                key={ticket.id}
                ticket={ticket}
                isLast={index === tickets.length - 1}
                onReview={() => onOpenTicket(ticket.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {total > 0 ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: palette.divider,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: palette.cardBg,
          }}
        >
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            isDesktop
            onPageChange={onPageChange}
            noun="requests"
          />
        </View>
      ) : null}
    </View>
  );
};

export default AdminSupportTable;
