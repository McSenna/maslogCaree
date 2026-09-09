import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import type { QueueOverview } from "@/services/appointments";
import { QUEUE_RADIUS, STAT_CARDS, useQueuePalette, type QueuePalette } from "./queueTheme";

function StatCard({
  label,
  value,
  caption,
  icon,
  tone,
  palette,
  loading,
  compact,
}: {
  label: string;
  value: number;
  caption: string;
  icon: keyof typeof Feather.glyphMap;
  tone: { bg: string; fg: string };
  palette: QueuePalette;
  loading: boolean;
  /** Two-up on a phone: less room for the label, so it wraps instead of clipping. */
  compact: boolean;
}) {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${label}: ${loading ? "loading" : value} ${caption}`}
      className={`min-w-0 flex-1 flex-row items-center border p-4 ${compact ? "gap-3" : "gap-3.5"}`}
      style={{
        borderRadius: QUEUE_RADIUS.panel,
        backgroundColor: palette.panelBg,
        borderColor: palette.panelBorder,
      }}
    >
      <View
        className="items-center justify-center rounded-full"
        style={{
          height: compact ? 40 : 48,
          width: compact ? 40 : 48,
          backgroundColor: tone.bg,
        }}
      >
        <Feather name={icon} size={compact ? 18 : 21} color={tone.fg} />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={compact ? 2 : 1}
          className="text-[13px] font-medium"
          style={{ color: palette.muted }}
        >
          {label}
        </Text>
        {loading ? (
          <View
            className="mt-1.5"
            style={{ height: 26, width: 48, borderRadius: 7, backgroundColor: palette.skeleton }}
          />
        ) : (
          <Text className="mt-0.5 text-[28px] font-bold" style={{ color: palette.heading }}>
            {value}
          </Text>
        )}
        <Text
          numberOfLines={compact ? 2 : 1}
          className="mt-0.5 text-[12px]"
          style={{ color: palette.subtle }}
        >
          {caption}
        </Text>
      </View>
    </View>
  );
}

/**
 * The four figures across the top of the screen.
 *
 * All four are counted server-side against the signed-in role's own services,
 * so a doctor's totals never include a midwife's caseload. There is
 * deliberately no "Current Queue" or "Completed Today" card: this system keeps
 * no queue state and no completed status, and a card that always reads zero
 * teaches staff to distrust the row.
 */
export default function QueueStatCards({
  overview,
  loading,
  wide,
}: {
  overview: QueueOverview | null;
  loading: boolean;
  /** Four across; otherwise a 2 x 2 grid. */
  wide: boolean;
}) {
  const palette = useQueuePalette();

  return (
    <View className={`w-full gap-3.5 ${wide ? "flex-row" : "flex-row flex-wrap"}`}>
      {STAT_CARDS.map((card) => (
        <View
          key={card.key}
          className="min-w-0"
          style={wide ? { flex: 1 } : { flexBasis: "47%", flexGrow: 1 }}
        >
          <StatCard
            label={card.label}
            caption={card.caption}
            icon={card.icon}
            tone={palette.tones[card.tone]}
            palette={palette}
            loading={loading}
            compact={!wide}
            value={
              overview ? (overview.stats[card.key as keyof QueueOverview["stats"]] ?? 0) : 0
            }
          />
        </View>
      ))}
    </View>
  );
}
