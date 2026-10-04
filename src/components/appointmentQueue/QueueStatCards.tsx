import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import InteractiveCard from "@/components/cards/InteractiveCard";
import ResponsiveGrid from "@/components/layout/ResponsiveGrid";
import type { QueueOverview } from "@/services/appointments";
import {
  QUEUE_RADIUS,
  STAT_CARDS,
  useQueuePalette,
  type AppointmentStatus,
  type QueuePalette,
} from "./queueTheme";

export type QueueCardKey = "today" | "pending" | "upcoming" | "declined";

/**
 * The appointments-list tab each card opens; "today" jumps to the day's
 * schedule instead. Upcoming opens Confirmed, the nearest list (it also holds
 * today's confirmed visits).
 */
export const QUEUE_CARD_STATUS: Record<QueueCardKey, AppointmentStatus | null> = {
  today: null,
  pending: "pending",
  upcoming: "confirmed",
  declined: "declined",
};

const CARD_HINTS: Record<QueueCardKey, string> = {
  today: "Jumps to today's schedule",
  pending: "Shows pending requests in the appointments list",
  upcoming: "Shows confirmed appointments in the appointments list",
  declined: "Shows declined appointments in the appointments list",
};

const StatCard = ({
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
  compact: boolean;
}) => {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={`${label}: ${loading ? "loading" : value} ${caption}`}
      className={`min-w-0 flex-1 border p-4 ${compact ? "items-start gap-2.5" : "flex-row items-center gap-3.5"}`}
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

      <View className={compact ? "w-full min-w-0" : "min-w-0 flex-1"}>
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
};

const QueueStatCards = ({
  overview,
  loading,
  wide,
  activeStatus,
  onSelectCard,
}: {
  overview: QueueOverview | null;
  loading: boolean;
  wide: boolean;
  /** The appointments list's tab, so the matching card shows as selected. */
  activeStatus: AppointmentStatus;
  onSelectCard: (key: QueueCardKey) => void;
}) => {
  const palette = useQueuePalette();

  return (
    <ResponsiveGrid
      minColumnWidth={wide ? 200 : 128}
      maxColumns={4}
      columnOptions={[1, 2, 4]}
      gap={14}
      initialColumns={{ mobile: 2, desktop: 4 }}
    >
      {STAT_CARDS.map((card) => {
        const key = card.key as QueueCardKey;
        const value = overview ? (overview.stats[card.key as keyof QueueOverview["stats"]] ?? 0) : 0;
        return (
          <InteractiveCard
            key={card.key}
            onPress={() => onSelectCard(key)}
            accessibilityLabel={`${card.label}: ${loading ? "loading" : value} ${card.caption}`}
            accessibilityHint={CARD_HINTS[key]}
            selected={QUEUE_CARD_STATUS[key] !== null && QUEUE_CARD_STATUS[key] === activeStatus}
            radius={QUEUE_RADIUS.panel}
          >
            <StatCard
              label={card.label}
              caption={card.caption}
              icon={card.icon}
              tone={palette.tones[card.tone]}
              palette={palette}
              loading={loading}
              compact={!wide}
              value={value}
            />
          </InteractiveCard>
        );
      })}
    </ResponsiveGrid>
  );
};

export default QueueStatCards;
