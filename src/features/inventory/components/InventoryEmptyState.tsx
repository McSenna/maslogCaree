import InventoryStateBlock from "./InventoryStateBlock";

type InventoryEmptyStateProps = {
  error: string | null;
  hasActiveFilters: boolean;
  canCreate: boolean;
  onRetry: () => void;
  onClearFilters: () => void;
  onAddItem: () => void;
};

/**
 * Why the list is empty, and what to do about it.
 *
 * Three different situations that all render as one block: the request failed,
 * the filters excluded everything, or there is genuinely nothing yet. Each
 * offers the action that actually resolves it.
 */
export default function InventoryEmptyState({
  error,
  hasActiveFilters,
  canCreate,
  onRetry,
  onClearFilters,
  onAddItem,
}: InventoryEmptyStateProps) {
  if (error) {
    return (
      <InventoryStateBlock
        icon="alert-circle"
        tone="error"
        title="Unable to load inventory."
        body="Please try again."
        action={{ label: "Retry", onPress: onRetry }}
      />
    );
  }

  if (hasActiveFilters) {
    return (
      <InventoryStateBlock
        icon="search"
        tone="neutral"
        title="No inventory items found."
        body="Try adjusting your search or filters."
        action={{ label: "Clear Filters", onPress: onClearFilters }}
      />
    );
  }

  return (
    <InventoryStateBlock
      icon="package"
      tone="neutral"
      title="No inventory items yet"
      body="Add medicines, vaccines, supplies, or equipment to start tracking stock."
      action={canCreate ? { label: "Add Item", onPress: onAddItem } : undefined}
    />
  );
}
