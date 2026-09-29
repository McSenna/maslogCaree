import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable, StatusPill, type TableColumn } from "@/components/dashboard/kit";
import type { AdminDashboardPalette, StatusToneName } from "@/design/adminDashboardTheme";
import type { InventoryAlert } from "@/services/staffDashboardService";
import { stockIssueOf, type StockIssue } from "../model/staffDashboardModel";

const ISSUE: Record<StockIssue, { label: string; tone: StatusToneName }> = {
  out: { label: "Out of stock", tone: "danger" },
  low: { label: "Low", tone: "warning" },
  expiring: { label: "Expiring", tone: "info" },
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

const IssuePill = ({ palette, item }: { palette: AdminDashboardPalette; item: InventoryAlert }) => {
  const issue = stockIssueOf(item);
  return issue ? <StatusPill palette={palette} tone={ISSUE[issue].tone} label={ISSUE[issue].label} /> : null;
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
  const columns: TableColumn<InventoryAlert>[] = [
    { key: "item", header: "Item", flex: 1, render: (item) => <ItemCell palette={palette} item={item} /> },
    {
      key: "stock",
      header: "In stock",
      width: 60,
      align: "right",
      render: (item) => (
        <Text className="text-[13.5px] font-bold" style={{ color: palette.heading, fontVariant: ["tabular-nums"] }}>
          {item.currentStock.toLocaleString()}
        </Text>
      ),
    },
    { key: "issue", header: "Status", width: 104, align: "right", render: (item) => <IssuePill palette={palette} item={item} /> },
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
        palette={palette}
        caption="Stock to watch"
        columns={columns}
        rows={items}
        rowKey={(item) => item._id}
        rowLabel={(item) => {
          const issue = stockIssueOf(item);
          return `${item.name}, ${item.currentStock} ${item.unit} in stock${issue ? `, ${ISSUE[issue].label}` : ""}`;
        }}
        onRowPress={onOpenInventory}
        rowHint="Opens the inventory"
        emptyIcon="check-circle"
        emptyMessage="Stock levels look healthy."
      />
    </PanelCard>
  );
};

export default StockWatchTable;
