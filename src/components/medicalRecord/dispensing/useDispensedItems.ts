import { useCallback, useMemo, useState } from "react";
import type { InventoryItem } from "@/features/inventory/services/inventoryService";
import type { DispenseInput } from "@/services/medicalRecords";

export type DispensedLine = {
  item: InventoryItem;
  quantity: number;
};

const clampQuantity = (value: number, available: number) => {
  if (!Number.isFinite(value)) return 1;
  const whole = Math.trunc(value);
  if (whole < 1) return 1;
  return available > 0 ? Math.min(whole, available) : whole;
};

export const useDispensedItems = () => {
  const [lines, setLines] = useState<DispensedLine[]>([]);

  const reset = useCallback(() => setLines([]), []);

  const add = useCallback((item: InventoryItem, quantity = 1) => {
    setLines((current) => {
      const index = current.findIndex((line) => line.item._id === item._id);
      if (index === -1) {
        return [...current, { item, quantity: clampQuantity(quantity, item.currentStock) }];
      }
      const next = [...current];
      const merged = next[index].quantity + quantity;
      next[index] = { ...next[index], quantity: clampQuantity(merged, item.currentStock) };
      return next;
    });
  }, []);

  const setQuantity = useCallback((itemId: string, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        line.item._id === itemId
          ? { ...line, quantity: clampQuantity(quantity, line.item.currentStock) }
          : line
      )
    );
  }, []);

  const remove = useCallback((itemId: string) => {
    setLines((current) => current.filter((line) => line.item._id !== itemId));
  }, []);

  const selectedIds = useMemo(() => new Set(lines.map((line) => line.item._id)), [lines]);

  const payload = useMemo<DispenseInput[]>(
    () => lines.map((line) => ({ inventoryItemId: line.item._id, quantity: line.quantity })),
    [lines]
  );

  return { lines, add, setQuantity, remove, reset, selectedIds, payload };
};
