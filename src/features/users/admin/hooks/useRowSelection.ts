import { useCallback, useMemo, useState } from "react";

/** Checked rows. "Select all" covers only the rows on screen. */
export const useRowSelection = (visibleIds: readonly string[]) => {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  // Rows that left the list (filtered away, deactivated) drop out of the selection.
  const selectedIds = useMemo(() => visibleIds.filter((id) => selected.has(id)), [visibleIds, selected]);

  const toggle = useCallback((id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allSelected = visibleIds.length > 0 && selectedIds.length === visibleIds.length;

  const toggleAll = useCallback(() => {
    setSelected(allSelected ? new Set() : new Set(visibleIds));
  }, [allSelected, visibleIds]);

  const clear = useCallback(() => setSelected(new Set()), []);

  return {
    selectedIds,
    isSelected: (id: string) => selected.has(id),
    count: selectedIds.length,
    allSelected,
    toggle,
    toggleAll,
    clear,
  };
};

export type RowSelection = ReturnType<typeof useRowSelection>;
