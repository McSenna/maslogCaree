import { useState } from "react";
import { Platform, ScrollView, View, useWindowDimensions } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import AdminSupportHeader from "../admin/AdminSupportHeader";
import AdminSupportStats from "../admin/AdminSupportStats";
import AdminSupportTable from "../admin/AdminSupportTable";
import AdminSupportToolbar from "../admin/AdminSupportToolbar";
import AdminTicketDetailsDialog from "../admin/AdminTicketDetailsDialog";
import SupportTicketList from "../support/SupportTicketList";
import { useAdminSupportTickets } from "../hooks/useAdminSupportTickets";

const AdminSupportScreen = () => {
  const { width } = useWindowDimensions();
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const support = useAdminSupportTickets();
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  const isDesktop = Platform.OS === "web" && width >= BREAKPOINTS.tablet;
  const horizontalPadding = width >= BREAKPOINTS.xl ? 32 : width >= BREAKPOINTS.tablet ? 24 : insets.gutter;

  return (
    <View style={{ flex: 1, backgroundColor: palette.pageBg, width: "100%" }}>
      <RoleScreenBackdrop color={palette.pageBg} insets={insets} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          gap: 20,
          paddingHorizontal: horizontalPadding,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom + 40,
        }}
      >
        <AdminSupportHeader
          total={support.total}
          refreshing={support.refreshing}
          onRefresh={support.refresh}
        />

        <AdminSupportStats counts={support.statusCounts} total={support.total} />

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
            totalPages={support.totalPages}
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
