import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { Badge, DataTable, type Column, type FeatherName } from "@/components/data-table";
import type { AdminDashboardPalette, StatusToneName } from "@/design/adminDashboardTheme";
import type { InventoryAlert } from "@/services/staffDashboardService";
import { stockIssueOf, type StockIssue } from "../model/staffDashboardModel";

const ISSUE: Record<StockIssue, { label: string; tone: StatusToneName; icon: FeatherName }> = {
  out: { label: "Out of stock", tone: "danger", icon: "x-circle" },
  low: { label: "Low", tone: "warning", icon: "alert-triangle" },
  expiring: { label: "Expiring", tone: "info", icon: "clock" },
};

const expiryLabel = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `Expires ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
};

const ItemCell = ({ palette, item }: { palette: AdminDashboardPalette; item: InventoryAlert }) => (
  <View className="min-w-0" style={{ alignSelf: "stretch" }}>
    <Text className="text-[13.5px] font-semibold" numberOfLines={2} style={{ color: palette.heading }}>
      {item.name}
    </Text>
    <Text className="text-[12px]" numberOfLines={1} style={{ color: palette.muted }}>
      {stockIssueOf(item) === "expiring" ? expiryLabel(item.nearestExpiry) : item.specification || item.category}
    </Text>
  </View>
);

const IssuePill = ({ item }: { item: InventoryAlert }) => {
  const issue = stockIssueOf(item);
  return issue ? <Badge tone={ISSUE[issue].tone} icon={ISSUE[issue].icon} label={ISSUE[issue].label} spokenAs="Stock" /> : null;
};

/** Stock in this role's categories that needs reordering or will expire soon. */
const StockWatchTable = ({
  palette,
  items,
  onOpenInventory,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  items: InventoryAlert[];
  onOpenInventory: () => void;
  fill?: boolean;
}) => {
  const columns: Column<InventoryAlert>[] = [
    { key: "item", header: "Item", flex: 1, minWidth: 140, render: (item) => <ItemCell palette={palette} item={item} /> },
    {
      key: "stock",
      header: "In stock",
      width: 92,
      align: "right",
      render: (item) => (
        <Text className="text-[13.5px] font-bold" style={{ color: palette.heading, fontVariant: ["tabular-nums"] }}>
          {item.currentStock.toLocaleString()}
        </Text>
      ),
    },
    { key: "issue", header: "Status", width: 152, align: "right", cardRole: "badge", render: (item) => <IssuePill item={item} /> },
  ];

  return (
    <PanelCard
      palette={palette}
      title="Stock to watch"
      icon="package"
      subtitle="Reorder or expiring soon"
      onViewAll={onOpenInventory}
      viewAllLabel="Inventory"
      fill={fill}
    >
      <DataTable
        caption="Stock to watch"
        surface="plain"
        density="compact"
        columns={columns}
        data={items}
        rowKey={(item) => item._id}
        rowLabel={(item) => {
          const issue = stockIssueOf(item);
          return `${item.name}, ${item.currentStock} ${item.unit} in stock${issue ? `, ${ISSUE[issue].label}` : ""}`;
        }}
        onRowPress={onOpenInventory}
        rowHint="Opens the inventory"
        emptyIcon="check-circle"
        emptyTitle="Stock levels look healthy."
      />
    </PanelCard>
  );
};

export default StockWatchTable;
