import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import AdminSupportStats from "../admin/AdminSupportStats";
import AdminSupportTable from "../admin/AdminSupportTable";
import AdminSupportToolbar from "../admin/AdminSupportToolbar";
import AdminTicketDetailsDialog from "../admin/AdminTicketDetailsDialog";
import { SUPPORT_TABLE_MIN_WIDTH } from "../admin/supportColumns";
import SupportTicketList from "../support/SupportTicketList";
import { useAdminSupportTickets } from "../hooks/useAdminSupportTickets";
import { useResponsive } from "@/hooks/useResponsive";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

const AdminSupportScreen = () => {
  const { isDesktopWeb } = useResponsive();
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);
  const [contentWidth, setContentWidth] = useState<number | null>(null);

  const isDesktop =
    isDesktopWeb && (contentWidth === null || contentWidth >= SUPPORT_TABLE_MIN_WIDTH);
  const support = useAdminSupportTickets({ appendPages: !isDesktop });
  const scrollRef = useScrollTopOnChange<ScrollView>(isDesktop ? support.page : 0);

  return (
    <View style={{ flex: 1, backgroundColor: palette.pageBg, width: "100%" }}>
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        ref={scrollRef}
        onLayout={(event) => {
          const next = Math.round(event.nativeEvent.layout.width - insets.gutter * 2);
          setContentWidth((current) => (current === next ? current : next));
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          gap: 20,
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom + 40,
        }}
      >
        <Text role="heading" aria-level={1} className="sr-only">
          Support Management
        </Text>

        <AdminSupportStats
          counts={support.statusCounts}
          activeStatus={support.query.status ?? "all"}
          onSelectStatus={(status) => support.updateQuery({ status })}
        />

        <AdminSupportToolbar
          query={support.query}
          onChange={support.updateQuery}
          onClear={support.clearFilters}
          hasActiveFilters={support.hasActiveFilters}
        />

        {isDesktop ? (
          <AdminSupportTable
            tickets={support.pageTickets}
            loading={support.loading}
            error={support.error}
            total={support.total}
            page={support.page}
            pageSize={support.pageSize}
            hasFilters={support.hasActiveFilters}
            onPageChange={support.setPage}
            onOpenTicket={setOpenTicketId}
            onRetry={support.refresh}
            onClearFilters={support.clearFilters}
          />
        ) : (
          <SupportTicketList
            tickets={support.tickets}
            loading={support.loading}
            loadingMore={support.loadingMore}
            hasMore={support.hasMore}
            error={support.error}
            emptyMessage="No support tickets match the current filters."
            showRequester
            onOpenTicket={setOpenTicketId}
            onLoadMore={support.loadMore}
            onRetry={support.refresh}
          />
        )}
      </ScrollView>

      <AdminTicketDetailsDialog
        ticketId={openTicketId}
        onClose={() => setOpenTicketId(null)}
        onChanged={support.refresh}
      />
    </View>
  );
};

export default AdminSupportScreen;
