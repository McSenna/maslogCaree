import { Feather } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { ROLE_LAYOUT_PADDING } from "@/components/layout/RoleLayout";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Toast, { useToast } from "@/components/ui/Toast";
import UsersPagination from "@/components/users/UsersPagination";
import {
  AddStockModal,
  CARD_SHADOW,
  DEFAULT_FILTERS,
  InventoryDetailsPanel,
  InventoryDetailsSheet,
  InventoryFilterSheet,
  InventoryHistoryModal,
  InventoryMetricCards,
  InventoryMobileCard,
  InventoryMobileToolbar,
  InventorySkeleton,
  InventoryTable,
  InventoryToolbar,
  ItemFormModal,
  RADIUS,
  ReleaseStockModal,
  SORT_OPTIONS,
  TABLE_MIN_WIDTH,
  useInventoryPalette,
  type InventoryFilterState,
} from "@/components/inventory";
import { useAuth } from "@/contexts/AuthContext";
import { useInventory } from "@/hooks/useInventory";
import {
  addStock,
  can,
  createInventoryItem,
  fetchInventoryItem,
  releaseStock,
  updateInventoryItem,
  type InventoryItem,
  type ItemMetadataPayload,
  type StockInPayload,
  type StockOutPayload,
} from "@/services/inventoryService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

const PAGE_SIZE = 8;

/** Search waits this long after the last keystroke before hitting the server. */
const SEARCH_DEBOUNCE_MS = 350;

/**
 * Content-area widths, measured rather than taken from the window: the sidebar
 * owns a fixed slice of the viewport, so the window width alone would put the
 * table into a layout the page does not have room for.
 */
const LAYOUT = {
  /** Four metric cards across instead of a 2x2 grid. */
  fourMetrics: 1000,
  /** The table replaces the card list. */
  table: 820,
  /** The details panel sits beside the table instead of below it. */
  sidePanel: 1180,
} as const;

/** Width the details column takes when it sits beside the table. */
const PANEL_WIDTH = 344;

/** Narrowest phones (320–360px) — trims the icon, keeps the grid. */
const DENSE_WINDOW_WIDTH = 380;

type ActiveModal = "none" | "add-item" | "edit-item" | "add-stock" | "release-stock" | "history";

function StateBlock({
  icon,
  tone,
  title,
  body,
  action,
}: {
  icon: keyof typeof Feather.glyphMap;
  tone: "neutral" | "error";
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
}) {
  const palette = useInventoryPalette();
  const iconBg = tone === "error" ? "#FEE2E2" : palette.divider;
  const iconColor = tone === "error" ? palette.danger : palette.subtle;

  return (
    <View className="w-full items-center gap-3 px-6 py-14">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          {title}
        </Text>
        <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
          {body}
        </Text>
      </View>
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="h-11 justify-center px-5"
          style={{ borderRadius: RADIUS.control, backgroundColor: palette.primary }}
        >
          <Text className="text-[14px] font-semibold text-white">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/**
 * Inventory Management.
 *
 * One screen for every staff role: the server returns the capabilities the
 * signed-in role has and the page draws only those actions, so a BHW and an
 * admin see the same inventory with different controls rather than two
 * divergent screens that have to be kept in step.
 */
export default function InventoryScreen() {
  const palette = useInventoryPalette();
  const { user } = useAuth();
  const { width: windowWidth } = useWindowDimensions();
  const { toast, showToast, hideToast } = useToast();

  // Spacing this page wants from the edge of the content area, minus what the
  // shell already applies — mirrors User Management and System Logs so the
  // pages line up under the header and against the sidebar.
  const isPhone = windowWidth < 768;
  const layoutPadding = isPhone ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;
  const gutter = Math.max(
    0,
    (isPhone ? 16 : windowWidth >= 1024 ? 32 : 24) - layoutPadding.horizontal
  );
  const paddingTop = Math.max(0, (isPhone ? 16 : 24) - layoutPadding.top);
  const paddingBottom = Math.max(0, (isPhone ? 28 : 32) - layoutPadding.bottom);

  // Measured content width, seeded from the window so the first paint is not a
  // phone layout on a desktop; replaced by the real figure on layout.
  const [contentWidth, setContentWidth] = useState(windowWidth);
  const [tableAreaWidth, setTableAreaWidth] = useState(0);
  const showTable = contentWidth >= LAYOUT.table;
  const fourMetrics = contentWidth >= LAYOUT.fourMetrics;
  const sideBySide = contentWidth >= LAYOUT.sidePanel;
  const dense = windowWidth < DENSE_WINDOW_WIDTH;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  // Held as one object rather than four states: the phone's filter sheet edits
  // a draft and commits it in a single Apply, which four setters would turn
  // into four renders and four refetches.
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);
  const { category, stockStatus, expiryStatus, sort } = filters;
  const [page, setPage] = useState(1);

  /** Any filter change returns to page 1 — page 4 of the old result set is meaningless. */
  const applyFilters = useCallback((next: InventoryFilterState) => {
    setFilters(next);
    setPage(1);
  }, []);

  // Typing must not fire a request per keystroke; the committed term is what
  // the query depends on.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(
    () => ({ page, limit: PAGE_SIZE, search, category, stockStatus, expiryStatus, sort }),
    [page, search, category, stockStatus, expiryStatus, sort]
  );

  const {
    items,
    summary,
    suppliers,
    permissions,
    total,
    totalPages,
    loading,
    refreshing,
    error,
    reload,
    refresh,
    applyItemUpdate,
  } = useInventory(query);

  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** The selected row, enriched with its batches by the detail request. */
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  /** Which phone sheet is open — the filter half, the sort half, or neither. */
  const [filterSheet, setFilterSheet] = useState<"filters" | "sort" | null>(null);
  /** A release awaiting confirmation, held so the dialog can state its effect. */
  const [pendingRelease, setPendingRelease] = useState<StockOutPayload | null>(null);

  const hasActiveFilters =
    search.length > 0 || category !== "all" || stockStatus !== "all" || expiryStatus !== "all";

  // Narrowing the results can leave the current page past the end of the list.
  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(1, totalPages)));
  }, [totalPages]);

  const selectedRow = useMemo(
    () => items.find((item) => item._id === selectedId) ?? null,
    [items, selectedId]
  );

  // The row from the list is shown immediately and the fuller record replaces
  // it when it lands, so opening the panel never blocks on a request.
  const panelItem = detailItem?._id === selectedId ? detailItem : selectedRow;

  const loadDetail = useCallback(async (itemId: string) => {
    setDetailLoading(true);
    try {
      const full = await fetchInventoryItem(itemId);
      setDetailItem(full);
    } catch {
      // The list row is already on screen and carries every field the panel
      // needs except the batch breakdown, so a failure here is not worth an
      // error state of its own.
      setDetailItem(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const selectItem = useCallback(
    (item: InventoryItem) => {
      setSelectedId(item._id);
      setDetailItem(item);
      void loadDetail(item._id);
    },
    [loadDetail]
  );

  const closeDetails = useCallback(() => {
    setSelectedId(null);
    setDetailItem(null);
  }, []);

  const toggleItem = useCallback((itemId: string, next: boolean) => {
    setCheckedIds((prev) => {
      const draft = new Set(prev);
      if (next) draft.add(itemId);
      else draft.delete(itemId);
      return draft;
    });
  }, []);

  const toggleAllOnPage = useCallback(
    (next: boolean) => {
      setCheckedIds((prev) => {
        const draft = new Set(prev);
        items.forEach((item) => (next ? draft.add(item._id) : draft.delete(item._id)));
        return draft;
      });
    },
    [items]
  );

  const openModal = useCallback((modal: ActiveModal, item?: InventoryItem) => {
    if (item) {
      setSelectedId(item._id);
      setDetailItem(item);
    }
    setFormError(null);
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal("none");
    setFormError(null);
    setPendingRelease(null);
  }, []);

  /**
   * Runs a mutation and settles the page around its result.
   *
   * A stock movement changes the summary counts and can move the row between
   * filtered pages, so the list is refetched rather than patched — but the
   * returned record is applied first so the panel updates without waiting.
   */
  const runMutation = useCallback(
    async (
      action: () => Promise<{ item: InventoryItem; message: string }>,
      fallbackMessage: string
    ) => {
      setSubmitting(true);
      setFormError(null);
      try {
        const { item: updated, message } = await action();
        applyItemUpdate(updated);
        setDetailItem(updated);
        setSelectedId(updated._id);
        closeModal();
        showToast(message || fallbackMessage, "success");
        await reload();
      } catch (e: unknown) {
        // The form stays open so the entry can be corrected without being
        // retyped — a rejected release is usually a quantity that needs a nudge.
        // The confirmation is dismissed either way, so the error is not left
        // sitting behind a dialog the user has already answered.
        setPendingRelease(null);
        setFormError(getApiErrorMessage(e, "That did not go through. Please try again."));
      } finally {
        setSubmitting(false);
      }
    },
    [applyItemUpdate, closeModal, reload, showToast]
  );

  const handleCreateItem = useCallback(
    (payload: ItemMetadataPayload) =>
      runMutation(() => createInventoryItem(payload), "Inventory item created successfully."),
    [runMutation]
  );

  const handleUpdateItem = useCallback(
    (payload: ItemMetadataPayload) => {
      if (!panelItem) return;
      return runMutation(
        () => updateInventoryItem(panelItem._id, payload),
        "Item updated successfully."
      );
    },
    [panelItem, runMutation]
  );

  const handleAddStock = useCallback(
    (payload: StockInPayload) => {
      if (!panelItem) return;
      return runMutation(() => addStock(panelItem._id, payload), "Stock added successfully.");
    },
    [panelItem, runMutation]
  );

  const handleReleaseStock = useCallback(
    (payload: StockOutPayload) => {
      if (!panelItem) return;
      return runMutation(() => releaseStock(panelItem._id, payload), "Stock released successfully.");
    },
    [panelItem, runMutation]
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    // Sort is a view preference, not a filter, so "Clear Filters" leaves it be.
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }));
    setPage(1);
  }, []);

  /**
   * The four actions, wherever Item Details is presented.
   *
   * Neither the table nor the mobile card carries its own action control any
   * more: selecting an item is the single entry point, and these are the
   * buttons the panel or sheet then draws — filtered by permission inside
   * `InventoryActions`, and re-checked by the server on every call.
   */
  const detailsActions = useMemo(
    () => ({
      onAddStock: () => openModal("add-stock"),
      onReleaseStock: () => openModal("release-stock"),
      onEditItem: () => openModal("edit-item"),
      onViewHistory: () => openModal("history"),
    }),
    [openModal]
  );

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refresh}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const desktopToolbar = (
    <InventoryToolbar
      search={searchInput}
      onSearchChange={setSearchInput}
      category={category}
      onCategoryChange={(value) => applyFilters({ ...filters, category: value })}
      stockStatus={stockStatus}
      onStockStatusChange={(value) => applyFilters({ ...filters, stockStatus: value })}
      expiryStatus={expiryStatus}
      onExpiryStatusChange={(value) => applyFilters({ ...filters, expiryStatus: value })}
      sort={sort}
      onSortChange={(value) => applyFilters({ ...filters, sort: value })}
      onAddItem={() => openModal("add-item")}
      canAddItem={can(permissions, "inventory.create")}
      isDesktop
      resultCount={total}
    />
  );

  /** How many filters are set, for the phone's Filters button badge. */
  const activeFilterCount = [category, stockStatus, expiryStatus].filter((v) => v !== "all").length;

  const mobileToolbar = (
    <InventoryMobileToolbar
      search={searchInput}
      onSearchChange={setSearchInput}
      activeFilterCount={activeFilterCount}
      sortLabel={SORT_OPTIONS.find((o) => o.value === sort)?.label ?? ""}
      onOpenFilters={() => setFilterSheet("filters")}
      onOpenSort={() => setFilterSheet("sort")}
      onAddItem={() => openModal("add-item")}
      canAddItem={can(permissions, "inventory.create")}
      resultCount={total}
    />
  );

  const emptyOrError = error ? (
    <StateBlock
      icon="alert-circle"
      tone="error"
      title="Unable to load inventory."
      body="Please try again."
      action={{ label: "Retry", onPress: () => void reload() }}
    />
  ) : hasActiveFilters ? (
    <StateBlock
      icon="search"
      tone="neutral"
      title="No inventory items found."
      body="Try adjusting your search or filters."
      action={{ label: "Clear Filters", onPress: clearFilters }}
    />
  ) : (
    <StateBlock
      icon="package"
      tone="neutral"
      title="No inventory items yet"
      body="Add medicines, vaccines, supplies, or equipment to start tracking stock."
      action={permissions.create ? { label: "Add Item", onPress: () => openModal("add-item") } : undefined}
    />
  );

  /** Desktop: toolbar, table and pagination inside one white section. */
  const tableCard = (
    <View
      className="w-full min-w-0 flex-1 overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      {loading ? (
        <InventorySkeleton count={PAGE_SIZE} />
      ) : error || items.length === 0 ? (
        emptyOrError
      ) : (
        // Below TABLE_MIN_WIDTH the ten columns cramp, so the table keeps its
        // proportions and scrolls sideways instead of squeezing.
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== tableAreaWidth) setTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(tableAreaWidth, TABLE_MIN_WIDTH) }}>
              <InventoryTable
                items={items}
                selectedItemId={selectedId}
                onSelectItem={selectItem}
                checkedIds={checkedIds}
                onToggleItem={toggleItem}
                onToggleAll={toggleAllOnPage}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!loading && !error && total > 0 ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <UsersPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={PAGE_SIZE}
            isDesktop
            onPageChange={setPage}
            noun="items"
          />
        </View>
      ) : null}
    </View>
  );

  const detailsPanel = (
    <InventoryDetailsPanel
      item={panelItem}
      permissions={permissions}
      loading={detailLoading}
      onClose={closeDetails}
      handlers={detailsActions}
    />
  );

  const overlays = (
    <>
      <ItemFormModal
        visible={activeModal === "add-item" || activeModal === "edit-item"}
        item={activeModal === "edit-item" ? panelItem : null}
        suppliers={suppliers}
        submitting={submitting}
        error={formError}
        onSubmit={activeModal === "edit-item" ? handleUpdateItem : handleCreateItem}
        onClose={closeModal}
      />
      <AddStockModal
        visible={activeModal === "add-stock"}
        item={panelItem}
        suppliers={suppliers}
        submitting={submitting}
        error={formError}
        onSubmit={handleAddStock}
        onClose={closeModal}
      />
      <ReleaseStockModal
        visible={activeModal === "release-stock"}
        item={panelItem}
        submitting={submitting}
        error={formError}
        releasedByName={user?.name || "Current user"}
        onSubmit={setPendingRelease}
        onClose={closeModal}
      />
      <InventoryHistoryModal
        visible={activeModal === "history"}
        item={panelItem}
        onClose={closeModal}
      />

      {/* Releasing stock is the one action here that cannot be undone from the
          UI, so it states its arithmetic before it happens. */}
      <ConfirmationModal
        visible={pendingRelease !== null}
        title={
          pendingRelease && panelItem
            ? `Release ${pendingRelease.quantity.toLocaleString()} ${panelItem.unit}?`
            : ""
        }
        message={
          pendingRelease && panelItem
            ? `This will reduce ${panelItem.name} from ${panelItem.currentStock.toLocaleString()} to ${(panelItem.currentStock - pendingRelease.quantity).toLocaleString()} ${panelItem.unit}.`
            : ""
        }
        confirmLabel="Confirm Release"
        destructive
        loading={submitting}
        onConfirm={() => {
          if (pendingRelease) void handleReleaseStock(pendingRelease);
        }}
        onCancel={() => setPendingRelease(null)}
      />

      {/* Phone-only sheets. Both are modals, so they sit above the bottom nav
          rather than being scrolled past inside the list. */}
      <InventoryDetailsSheet
        visible={!showTable && panelItem !== null}
        item={panelItem}
        permissions={permissions}
        loading={detailLoading}
        onClose={closeDetails}
        handlers={detailsActions}
      />
      <InventoryFilterSheet
        visible={filterSheet !== null}
        mode={filterSheet ?? "filters"}
        value={filters}
        onApply={(next) => {
          applyFilters(next);
          setFilterSheet(null);
        }}
        onClose={() => setFilterSheet(null)}
      />

      <Toast toast={toast} onDismiss={hideToast} />
    </>
  );

  /**
   * Page title — phone layout only.
   *
   * The desktop shell already names the page in its sidebar and chrome, so
   * repeating it above the metric cards spends a band of vertical space saying
   * what the surrounding frame has said. A phone has no sidebar to carry that,
   * so the card list keeps its heading.
   */
  const mobilePageHeader = (
    <View className="w-full gap-1">
      <Text accessibilityRole="header" className="text-[26px] font-extrabold" style={{ color: palette.heading }}>
        Inventory Management
      </Text>
      <Text className="text-[14px] font-medium" style={{ color: palette.muted }}>
        Manage medicines, vaccines, supplies and equipment
      </Text>
    </View>
  );

  const pageTint = (
    // The page tint runs edge to edge behind the shell's padding, the same way
    // the other admin pages paint it, so the sidebar and header meet this page
    // without a seam.
    <View
      style={{
        position: "absolute",
        top: -layoutPadding.top,
        bottom: -layoutPadding.bottom,
        left: -layoutPadding.horizontal,
        right: -layoutPadding.horizontal,
        backgroundColor: palette.pageBg,
      }}
    />
  );

  const onLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== contentWidth) setContentWidth(next);
  };

  // A role the server grants no view permission to should not be looking at an
  // empty table and wondering whether the data failed to load.
  if (!loading && !permissions.view && !error) {
    return (
      <View className="flex-1" onLayout={onLayout}>
        {pageTint}
        <View className="flex-1 items-center justify-center p-6">
          <StateBlock
            icon="lock"
            tone="neutral"
            title="Inventory is not available for your role"
            body="Contact your administrator if you need access to inventory management."
          />
        </View>
      </View>
    );
  }

  if (showTable) {
    return (
      <View className="flex-1" onLayout={onLayout}>
        {pageTint}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, paddingTop, paddingBottom }}
          refreshControl={refreshControl}
        >
          <View className="w-full gap-5">
            <InventoryMetricCards summary={summary} isWide={fourMetrics} />

            {/* The toolbar sits above the split so the filters keep the full
                content width, and its controls float on the page tint rather
                than on a card — each one carries its own border in the design. */}
            {desktopToolbar}

            {sideBySide ? (
              <View className="w-full flex-row items-start gap-4">
                {tableCard}
                <View style={{ width: PANEL_WIDTH }}>{detailsPanel}</View>
              </View>
            ) : (
              // Between 820 and 1180px the table needs its full width, so the
              // panel drops underneath it rather than squeezing the columns.
              <View className="w-full gap-4">
                {tableCard}
                {panelItem ? detailsPanel : null}
              </View>
            )}
          </View>
        </ScrollView>
        {overlays}
      </View>
    );
  }

  const mobileHeader = (
    <View className="w-full gap-4 pb-3">
      {mobilePageHeader}
      <InventoryMetricCards summary={summary} isWide={false} />
      {mobileToolbar}
    </View>
  );

  const mobileFooter =
    !loading && !error && total > 0 ? (
      <View className="w-full pt-4">
        <UsersPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          isDesktop={false}
          onPageChange={setPage}
          noun="items"
        />
      </View>
    ) : null;

  const mobileEmpty = loading ? (
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
      {emptyOrError}
    </View>
  );

  // On a phone the details are a full-width sheet under the list rather than a
  const listContentStyle = { paddingHorizontal: gutter, paddingTop, paddingBottom, flexGrow: 1 };

  // react-native-web has no virtualization to gain here — the list is already
  // capped at one page — and a FlatList there interferes with page scrolling,
  // so the same cards render inside a ScrollView on web.
  if (Platform.OS === "web") {
    return (
      <View className="flex-1" onLayout={onLayout}>
        {pageTint}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContentStyle}
          refreshControl={refreshControl}
        >
          {mobileHeader}
          {items.length === 0 ? (
            mobileEmpty
          ) : (
            <View className="w-full gap-2.5">
              {items.map((item) => (
                <InventoryMobileCard
                  key={item._id}
                  item={item}
                  dense={dense}
                  onPress={() => selectItem(item)}
                />
              ))}
            </View>
          )}
          {mobileFooter}
        </ScrollView>
        {overlays}
      </View>
    );
  }

  return (
    <View className="flex-1" onLayout={onLayout}>
      {pageTint}
      <FlatList
        className="flex-1"
        data={loading || error ? [] : items}
        keyExtractor={(item) => item._id}
        contentContainerStyle={listContentStyle}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={mobileHeader}
        ListEmptyComponent={mobileEmpty}
        ListFooterComponent={
          <>
              {mobileFooter}
          </>
        }
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        renderItem={({ item }) => (
          <InventoryMobileCard
            item={item}
            dense={dense}
            onPress={() => selectItem(item)}
          />
        )}
      />
      {overlays}
    </View>
  );
}
