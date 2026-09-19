import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { SUPPORT_STATUS_LABELS, SUPPORT_STATUS_ORDER } from "../constants/support.constants";
import type { SupportStatus } from "../types/support.types";

type AdminSupportSummaryProps = {
  counts: Partial<Record<SupportStatus, number>>;
  total: number;
};

const AdminSupportSummary = ({ counts, total }: AdminSupportSummaryProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
      {[{ key: "total", label: "Total", value: total }].concat(
        SUPPORT_STATUS_ORDER.map((status) => ({
          key: status,
          label: SUPPORT_STATUS_LABELS[status],
          value: counts[status] ?? 0,
        }))
      ).map((entry) => (
        <View
          key={entry.key}
          style={{
            minWidth: 0,
            flexGrow: 1,
            flexBasis: 120,
            gap: 2,
            padding: 12,
            borderRadius: RADIUS.panel,
            backgroundColor: palette.cardBg,
            borderWidth: 1,
            borderColor: palette.cardBorder,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: palette.subtle }}>
            {entry.label.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 19, fontWeight: "700", color: palette.heading }}>
            {entry.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default AdminSupportSummary;
