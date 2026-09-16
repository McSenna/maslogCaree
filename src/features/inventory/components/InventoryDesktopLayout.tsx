import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import type { InventoryScreenController } from "../hooks/useInventoryScreen";
import { PANEL_WIDTH } from "../constants/inventoryLayout";
import { can } from "../services/inventoryService";
import InventoryDetailsPanel from "./InventoryDetailsPanel";
import InventoryMetricCards from "./InventoryMetricCards";
import InventoryTableCard from "./InventoryTableCard";
import InventoryToolbar from "./InventoryToolbar";
import { useInventoryPalette } from "./inventoryTheme";

type InventoryDesktopLayoutProps = {
  controller: InventoryScreenController;
  emptyState: ReactNode;
};

const InventoryDesktopLayout = ({
  controller,
  emptyState,
}: InventoryDesktopLayoutProps) => {
  const palette = useInventoryPalette();
  const { query, data, selection, mutations, detailsActions, sideBySide } = controller;
  const { filters } = query;

  const tableCard = (
    <InventoryTableCard
      items={data.items}
      loading={data.loading}
      error={data.error}
      fallback={emptyState}
      selectedId={selection.selectedId}
      onSelectItem={selection.selectItem}
      checkedIds={selection.checkedIds}
      onToggleItem={selection.toggleItem}
      onToggleAll={selection.toggleAllOnPage}
      tableAreaWidth={controller.tableAreaWidth}
      onTableAreaWidth={controller.setTableAreaWidth}
      page={query.page}
      totalPages={data.totalPages}
      total={data.total}
      onPageChange={query.setPage}
    />
  );

  const detailsPanel = (
    <InventoryDetailsPanel
      item={selection.panelItem}
      permissions={data.permissions}
      loading={selection.detailLoading}
      onClose={selection.closeDetails}
      handlers={detailsActions}
    />
  );

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={controller.contentPadding}
      refreshControl={
        <RefreshControl
          refreshing={data.refreshing}
          onRefresh={data.refresh}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View className="w-full gap-5">
        <InventoryMetricCards summary={data.summary} isWide={controller.fourMetrics} />

        <InventoryToolbar
          search={query.searchInput}
          onSearchChange={query.setSearchInput}
          category={filters.category}
          onCategoryChange={(value) => query.applyFilters({ ...filters, category: value })}
          stockStatus={filters.stockStatus}
          onStockStatusChange={(value) => query.applyFilters({ ...filters, stockStatus: value })}
          expiryStatus={filters.expiryStatus}
          onExpiryStatusChange={(value) => query.applyFilters({ ...filters, expiryStatus: value })}
          sort={filters.sort}
          onSortChange={(value) => query.applyFilters({ ...filters, sort: value })}
          onAddItem={() => mutations.openModal("add-item")}
          canAddItem={can(data.permissions, "inventory.create")}
          isDesktop
          resultCount={data.total}
        />

        {sideBySide ? (
          <View className="w-full flex-row items-start gap-4">
            {tableCard}
            <View style={{ width: PANEL_WIDTH }}>{detailsPanel}</View>
          </View>
        ) : (
          <View className="w-full gap-4">
            {tableCard}
            {selection.panelItem ? detailsPanel : null}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default InventoryDesktopLayout;
