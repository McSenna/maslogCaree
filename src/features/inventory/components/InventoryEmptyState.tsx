import StateBlock from "@/components/ui/StateBlock";

export const INVENTORY_ERROR = "Unable to load inventory.";

/** Nothing stocked yet, or nothing matching the filters. Only users who can add items get that action. */
export const inventoryEmptyCopy = (hasActiveFilters: boolean) =>
  hasActiveFilters
    ? { icon: "search" as const, title: "No inventory items found.", body: "Try adjusting your search or filters.", action: "Clear filters" }
    : {
        icon: "package" as const,
        title: "No inventory items yet",
        body: "Add medicines, vaccines, supplies, or equipment to start tracking stock.",
        action: "Add item",
      };

type InventoryEmptyStateProps = {
  error: string | null;
  hasActiveFilters: boolean;
  canCreate: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onAddItem: () => void;
};

/** The phone list's error and empty states; the desktop table draws the same ones itself. */
const InventoryEmptyState = ({ error, hasActiveFilters, canCreate, onRetry, onClearFilters, onAddItem }: InventoryEmptyStateProps) => {
  if (error) {
    return (
      <StateBlock icon="alert-circle" tone="error" title={INVENTORY_ERROR} body="Please try again." action={{ label: "Retry", onPress: onRetry }} />
    );
  }

  const copy = inventoryEmptyCopy(hasActiveFilters);
  const onPress = hasActiveFilters ? onClearFilters : onAddItem;
  const showAction = hasActiveFilters || canCreate;
  return (
    <StateBlock
      icon={copy.icon}
      tone="neutral"
      title={copy.title}
      body={copy.body}
      action={showAction ? { label: copy.action, onPress } : undefined}
    />
  );
};

export default InventoryEmptyState;
