import StatusPill from "@/components/status/StatusPill";
import { useInventoryPalette, type DisplayStatus } from "./inventoryTheme";

type StockStatusBadgeProps = {
  status: DisplayStatus;
  compact?: boolean;
};

const StockStatusBadge = ({ status, compact = false }: StockStatusBadgeProps) => {
  const palette = useInventoryPalette();
  const tone = palette.statuses[status] ?? palette.statuses["in-stock"];
  return (
    <StatusPill label={tone.label} icon={tone.icon} compact={compact} tone={{ bg: tone.bg, fg: tone.text, border: tone.border }} />
  );
};

export default StockStatusBadge;
