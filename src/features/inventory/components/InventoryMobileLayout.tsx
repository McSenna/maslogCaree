import type { ReactNode } from "react";
import { FlatList, Platform, RefreshControl, ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import type { InventoryScreenController } from "../hooks/useInventoryScreen";
import { PAGE_SIZE } from "../constants/inventoryLayout";
import { can } from "../services/inventoryService";
import InventoryMobileCard from "./InventoryMobileCard";
import InventoryMobileHeader from "./InventoryMobileHeader";
import InventoryMobileToolbar from "./InventoryMobileToolbar";
import InventorySkeleton from "./InventorySkeleton";
import { SORT_OPTIONS } from "./inventoryFilters";
import { RADIUS, useInventoryPalette } from "./inventoryTheme";

type InventoryMobileLayoutProps = {
  controller: InventoryScreenController;
  emptyState: ReactNode;
};

/** Phone: a card list with the heading, metrics and toolbar riding above it. */
export default function InventoryMobileLayout({
  controller,
  emptyState,
}: InventoryMobileLayoutProps) {
  const palette = useInventoryPalette();
  const { query, data, selection, mutations, dense } = controller;

  const refreshControl = (
    <RefreshControl
      refreshing={data.refreshing}
      onRefresh={data.refresh}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const header = (
    <InventoryMobileHeader
      summary={data.summary}
      toolbar={
        <InventoryMobileToolbar
          search={query.searchInput}
          onSearchChange={query.setSearchInput}
          activeFilterCount={query.activeFilterCount}
          sortLabel={
            SORT_OPTIONS.find((option) => option.value === query.filters.sort)?.label ?? ""
          }
          onOpenFilters={() => controller.setFilterSheet("filters")}
          onOpenSort={() => controller.setFilterSheet("sort")}
          onAddItem={() => mutations.openModal("add-item")}
          canAddItem={can(data.permissions, "inventory.create")}
          resultCount={data.total}
        />
      }
    />
  );

  const footer =
    !data.loading && !data.error && data.total > 0 ? (
      <View className="w-full pt-4">
        <Pagination
          page={query.page}
          totalPages={data.totalPages}
          total={data.total}
          pageSize={PAGE_SIZE}
          isDesktop={false}
          onPageChange={query.setPage}
          noun="items"
        />
      </View>
    ) : null;

  const empty = data.loading ? (
    <InventorySkeleton count={6} isMobile dense={dense} />
  ) : (
    <View
      className="w-full border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      {emptyState}
    </View>
  );

  const listContentStyle = { ...controller.contentPadding, flexGrow: 1 };

  // react-native-web has no virtualization to gain here — the list is already
  // capped at one page — and a FlatList there interferes with page scrolling,
  // so the same cards render inside a ScrollView on web.
  if (Platform.OS === "web") {
    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listContentStyle}
        refreshControl={refreshControl}
      >
        {header}
        {data.items.length === 0 ? (
          empty
        ) : (
          <View className="w-full gap-2.5">
            {data.items.map((item) => (
              <InventoryMobileCard
                key={item._id}
                item={item}
                dense={dense}
                onPress={() => selection.selectItem(item)}
              />
            ))}
          </View>
        )}
        {footer}
      </ScrollView>
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={data.loading || data.error ? [] : data.items}
      keyExtractor={(item) => item._id}
      contentContainerStyle={listContentStyle}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={footer}
      ItemSeparatorComponent={() => <View className="h-2.5" />}
      renderItem={({ item }) => (
        <InventoryMobileCard
          item={item}
          dense={dense}
          onPress={() => selection.selectItem(item)}
        />
      )}
    />
  );
}
