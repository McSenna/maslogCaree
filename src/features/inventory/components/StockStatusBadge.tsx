import { Badge } from "@/components/data-table";

import { useInventoryPalette, type DisplayStatus } from "./inventoryTheme";

type StockStatusBadgeProps = {
  status: DisplayStatus;
  compact?: boolean;
};

const StockStatusBadge = ({ status, compact = false }: StockStatusBadgeProps) => {
  const palette = useInventoryPalette();
  const tone = palette.statuses[status] ?? palette.statuses["in-stock"];
  return (
    <Badge tone={{ bg: tone.bg, fg: tone.text }} icon={tone.icon} label={tone.label} spokenAs="Stock status" size={compact ? "sm" : "md"} />
  );
};

export default StockStatusBadge;
