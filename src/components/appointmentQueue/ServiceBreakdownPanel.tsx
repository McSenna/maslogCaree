import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { ServiceBreakdownRow } from "@/services/appointments";
import QueuePanel from "./QueuePanel";
import { useQueuePalette } from "./queueTheme";

/** One icon per service, so a row is recognisable before it is read. */
const SERVICE_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  consultation: "message-circle",
  general_checkup: "clipboard",
  prenatal: "heart",
  immunization: "shield",
  bp_checking: "activity",
};

/**
 * How the caller's own caseload divides across their services.
 *
 * Only the signed-in role's services are listed — a BHW sees BP Checking and
 * nothing else, not four zero rows for work that will never reach them. A
 * service the role does own is shown even at zero, because "none today" is
 * itself the answer to the question the panel asks.
 */
export default function ServiceBreakdownPanel({
  rows,
  loading,
}: {
  rows: ServiceBreakdownRow[];
  loading: boolean;
}) {
  const palette = useQueuePalette();
  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <QueuePanel icon="bar-chart-2" title="Service Breakdown">
      {loading ? (
        <View className="gap-3.5 py-2">
          {[0, 1].map((i) => (
            <View key={i} className="flex-row items-center gap-3">
              <View style={{ height: 14, width: 110, borderRadius: 6, backgroundColor: palette.skeleton }} />
              <View className="flex-1" style={{ height: 8, borderRadius: 999, backgroundColor: palette.skeleton }} />
            </View>
          ))}
        </View>
      ) : (
        <View className="w-full gap-3 py-1.5">
          {rows.map((row) => (
            <View
              key={row.key}
              accessibilityRole="text"
              accessibilityLabel={`${row.label}: ${row.count}`}
              className="w-full flex-row items-center gap-3"
            >
              <Feather
                name={SERVICE_ICONS[row.key] ?? "activity"}
                size={16}
                color={palette.primary}
              />
              <Text
                numberOfLines={1}
                className="text-[13.5px] font-medium"
                style={{ color: palette.body, width: 132 }}
              >
                {row.label}
              </Text>

              {/* Bars are scaled against the busiest service, not a fixed
                  ceiling, so the shape stays readable at any volume. */}
              <View
                className="min-w-0 flex-1 overflow-hidden"
                style={{ height: 8, borderRadius: 999, backgroundColor: palette.skeleton }}
              >
                <View
                  style={{
                    height: 8,
                    borderRadius: 999,
                    width: `${Math.round((row.count / max) * 100)}%`,
                    backgroundColor: palette.primary,
                  }}
                />
              </View>

              <Text
                className="w-7 text-right text-[13.5px] font-bold"
                style={{ color: palette.heading }}
              >
                {row.count}
              </Text>
            </View>
          ))}
        </View>
      )}
    </QueuePanel>
  );
}
