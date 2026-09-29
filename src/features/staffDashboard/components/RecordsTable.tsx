import { Text, View } from "react-native";
import PanelCard from "@/components/dashboard/admin/PanelCard";
import { DataTable, type TableColumn } from "@/components/dashboard/kit";
import type { AdminDashboardPalette } from "@/design/adminDashboardTheme";
import type { StaffActivity } from "@/services/staffDashboardService";
import ServiceBadge from "./ServiceBadge";

const VISIBLE_ROWS = 6;

const completedLabel = (iso: string, now: Date = new Date()): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return d.toDateString() === now.toDateString()
    ? `Today, ${time}`
    : `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${time}`;
};

/** Readings for BP checks ("120/80 mmHg"-style values); otherwise how many items were given. */
const detailOf = (activity: StaffActivity): string => {
  const readings = activity.highlights.map((h) => `${h.label} ${h.value}${h.unit ? ` ${h.unit}` : ""}`).join(", ");
  if (readings) return readings;
  if (activity.itemsGivenCount > 0) {
    return `${activity.itemsGivenCount} ${activity.itemsGivenCount === 1 ? "item" : "items"} given`;
  }
  return "";
};

const RecordsTable = ({
  palette,
  activities,
  title,
  subtitle,
  personNoun,
  showService,
  compact,
  fill = false,
}: {
  palette: AdminDashboardPalette;
  activities: StaffActivity[];
  title: string;
  subtitle: string;
  personNoun: string;
  showService: boolean;
  compact: boolean;
  fill?: boolean;
}) => {
  const rows = activities.slice(0, VISIBLE_ROWS);

  const columns: TableColumn<StaffActivity>[] = [
    {
      key: "patient",
      header: personNoun === "resident" ? "Resident" : "Patient",
      flex: 1.4,
      render: (row) => (
        <Text className="text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
          {row.patientName}
        </Text>
      ),
    },
    ...(showService
      ? [
          {
            key: "service",
            header: "Service",
            width: 140,
            minTableWidth: 520,
            render: (row: StaffActivity) => (
              <ServiceBadge serviceKey={row.serviceType} label={row.serviceLabel} compact />
            ),
          },
        ]
      : []),
    {
      key: "detail",
      header: "Details",
      flex: 1.6,
      minTableWidth: 440,
      render: (row) => (
        <Text className="text-[13px]" numberOfLines={1} style={{ color: palette.body, fontVariant: ["tabular-nums"] }}>
          {detailOf(row)}
        </Text>
      ),
    },
    {
      key: "completed",
      header: "Filed",
      width: 118,
      align: "right",
      render: (row) => (
        <Text className="text-[12.5px] font-medium" numberOfLines={1} style={{ color: palette.muted, fontVariant: ["tabular-nums"] }}>
          {completedLabel(row.completedAt)}
        </Text>
      ),
    },
  ];

  return (
    <PanelCard palette={palette} title={title} icon="file-text" subtitle={subtitle} fill={fill}>
      <DataTable
        palette={palette}
        caption={title}
        columns={columns}
        rows={rows}
        rowKey={(row) => row._id}
        rowLabel={(row) => [row.patientName, row.serviceLabel, detailOf(row), completedLabel(row.completedAt)].filter(Boolean).join(", ")}
        stacked={compact}
        renderStacked={(row) => (
          <>
            <View className="flex-row items-center gap-3">
              <Text className="min-w-0 flex-1 text-[13.5px] font-semibold" numberOfLines={1} style={{ color: palette.heading }}>
                {row.patientName}
              </Text>
              <Text className="text-[12px] font-medium" style={{ color: palette.subtle, fontVariant: ["tabular-nums"] }}>
                {completedLabel(row.completedAt)}
              </Text>
            </View>
            <View className="flex-row flex-wrap items-center gap-2">
              {showService ? <ServiceBadge serviceKey={row.serviceType} label={row.serviceLabel} compact /> : null}
              {detailOf(row) ? (
                <Text className="text-[12.5px] font-medium" style={{ color: palette.body, fontVariant: ["tabular-nums"] }}>
                  {detailOf(row)}
                </Text>
              ) : null}
            </View>
          </>
        )}
        emptyIcon="file-text"
        emptyMessage="Nothing filed yet for this service."
      />
    </PanelCard>
  );
};

export default RecordsTable;
