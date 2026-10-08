import { useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import type { InventoryScreenController } from "../hooks/useInventoryScreen";
import { PAGE_SIZE, PANEL_WIDTH } from "../constants/inventoryLayout";
import { can } from "../services/inventoryService";
import InventoryDetailsPanel from "./InventoryDetailsPanel";
import InventoryMetricCards from "./InventoryMetricCards";
import { DataTable } from "@/components/data-table";
import { INVENTORY_ERROR, inventoryEmptyCopy } from "./InventoryEmptyState";
import { inventoryColumns } from "./inventoryColumns";
import InventoryToolbar from "./InventoryToolbar";
import { useInventoryPalette } from "./inventoryTheme";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

type InventoryDesktopLayoutProps = {
  controller: InventoryScreenController;
};

const InventoryDesktopLayout = ({ controller }: InventoryDesktopLayoutProps) => {
  const palette = useInventoryPalette();
  const { query, data, selection, mutations, detailsActions, sideBySide } = controller;
  const { filters } = query;
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(query.page);

  const checkedOnPage = data.items.filter((item) => selection.checkedIds.has(item._id)).length;
  const allChecked = data.items.length > 0 && checkedOnPage === data.items.length;
  const columns = useMemo(
    () =>
      inventoryColumns({
        checkedIds: selection.checkedIds,
        allChecked,
        someChecked: checkedOnPage > 0 && !allChecked,
        onToggleItem: selection.toggleItem,
        onToggleAll: selection.toggleAllOnPage,
        onOpen: selection.selectItem,
      }),
    [selection.checkedIds, allChecked, checkedOnPage, selection.toggleItem, selection.toggleAllOnPage, selection.selectItem]
  );
  const empty = inventoryEmptyCopy(query.hasActiveFilters);
  const emptyAction = query.hasActiveFilters
    ? { label: empty.action, icon: "x" as const, onPress: query.clearFilters, variant: "outlined" as const }
    : can(data.permissions, "inventory.create")
      ? { label: empty.action, icon: "plus" as const, onPress: () => mutations.openModal("add-item") }
      : undefined;

  const tableCard = (
    <View className="min-w-0 flex-1">
      <DataTable
        caption="Inventory items"
        columns={columns}
        data={data.items}
        rowKey={(item) => item._id}
        loading={data.loading}
        refreshing={data.refreshing}
        error={data.error ? "Please try again." : null}
        errorTitle={INVENTORY_ERROR}
        onRetry={() => void data.reload()}
        emptyIcon={empty.icon}
        emptyTitle={empty.title}
        emptyDescription={empty.body}
        emptyAction={emptyAction}
        onRowPress={selection.selectItem}
        rowPressMode="pointer"
        isRowSelected={(item) => item._id === selection.selectedId}
        pagination={{ page: query.page, pageSize: PAGE_SIZE, total: data.total, onPageChange: query.setPage, noun: "items" }}
      />
    </View>
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
      ref={scrollRef}
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
        <InventoryMetricCards
          summary={data.summary}
          isWide={controller.fourMetrics}
          activeCard={query.activeCard}
          onSelectCard={query.showCard}
        />

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
