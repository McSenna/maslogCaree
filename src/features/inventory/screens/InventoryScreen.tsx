import { View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import InventoryDesktopLayout from "../components/InventoryDesktopLayout";
import InventoryEmptyState from "../components/InventoryEmptyState";
import InventoryMobileLayout from "../components/InventoryMobileLayout";
import InventoryOverlays from "../components/InventoryOverlays";
import InventoryStateBlock from "../components/InventoryStateBlock";
import { useInventoryPalette } from "../components/inventoryTheme";
import { useInventoryScreen } from "../hooks/useInventoryScreen";

const InventoryScreen = () => {
  const palette = useInventoryPalette();
  const controller = useInventoryScreen();
  const { data, selection, mutations, query, showTable } = controller;

  const pageTint = <RoleScreenBackdrop color={palette.pageBg} insets={controller.insets} />;

  if (!data.loading && !data.permissions.view && !data.error) {
    return (
      <View className="flex-1" onLayout={controller.measureContent}>
        {pageTint}
        <View className="flex-1 items-center justify-center p-6">
          <InventoryStateBlock
            icon="lock"
            tone="neutral"
            title="Inventory is not available for your role"
            body="Contact your administrator if you need access to inventory management."
          />
        </View>
      </View>
    );
  }

  const emptyState = (
    <InventoryEmptyState
      error={data.error}
      hasActiveFilters={query.hasActiveFilters}
      canCreate={data.permissions.create}
      onRetry={() => void data.reload()}
      onClearFilters={query.clearFilters}
      onAddItem={() => mutations.openModal("add-item")}
    />
  );

  return (
    <View className="flex-1" onLayout={controller.measureContent}>
      {pageTint}

      {showTable ? (
        <InventoryDesktopLayout controller={controller} emptyState={emptyState} />
      ) : (
        <InventoryMobileLayout controller={controller} emptyState={emptyState} />
      )}

      <InventoryOverlays
        activeModal={mutations.activeModal}
        panelItem={selection.panelItem}
        suppliers={data.suppliers}
        permissions={data.permissions}
        submitting={mutations.submitting}
        formError={mutations.formError}
        detailLoading={selection.detailLoading}
        releasedByName={controller.user?.name || "Current user"}
        detailsActions={controller.detailsActions}
        onCreateItem={mutations.createItem}
        onUpdateItem={mutations.updateItem}
        onAddStock={mutations.addItemStock}
        onCloseModal={mutations.closeModal}
        pendingRelease={mutations.pendingRelease}
        onRequestRelease={mutations.setPendingRelease}
        onCancelRelease={() => mutations.setPendingRelease(null)}
        onConfirmRelease={(payload) => void mutations.releaseItemStock(payload)}
        showDetailsSheet={!showTable && selection.panelItem !== null}
        onCloseDetails={selection.closeDetails}
        filterSheet={controller.filterSheet}
        filters={query.filters}
        onApplyFilters={(next) => {
          query.applyFilters(next);
          controller.setFilterSheet(null);
        }}
        onCloseFilterSheet={() => controller.setFilterSheet(null)}
        toast={controller.toast}
        onHideToast={controller.hideToast}
      />
    </View>
  );
};

export default InventoryScreen;
