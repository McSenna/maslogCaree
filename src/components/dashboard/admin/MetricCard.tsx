import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  DASHBOARD_CARD_SHADOW,
  DASHBOARD_RADIUS,
  type AdminDashboardPalette,
  type MetricTone,
} from "@/design/adminDashboardTheme";
import TrendPill from "./TrendPill";
import { useCountUp } from "./useCountUp";

export type MetricCardProps = {
  palette: AdminDashboardPalette;
  tone: MetricTone;
  label: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  /** Caption under the figure — what the number actually counts. */
  description: string;
  /** Percentage change against the same metric a month ago. */
  growth?: number | null;
  compact?: boolean;
  /**
   * Narrowest phones (320–360px). Trims the icon and type rather than dropping
   * the 2x2 grid to a single column.
   */
  dense?: boolean;
};

/**
 * A dashboard statistic.
 *
 * Matches the User Management metric cards: a white card carrying its tone in
 * the icon chip only, with the month-over-month change as a filled pill beside
 * the label rather than a sentence under the figure. Four tinted card surfaces
 * across the top of a page turn it into a colour block; four white ones read as
 * data.
 */
export default function MetricCard({
  palette,
  tone,
  label,
  value,
  icon,
  description,
  growth,
  compact = false,
  dense = false,
}: MetricCardProps) {
  const toneStyle = palette.tones[tone];
  const showTrend = typeof growth === "number" && Number.isFinite(growth);
  const displayValue = useCountUp(value);

  const surface = {
    backgroundColor: palette.cardBg,
    borderColor: palette.cardBorder,
    borderRadius: DASHBOARD_RADIUS.card,
    ...DASHBOARD_CARD_SHADOW,
  };

  // The label announces the settled figure, never the mid-animation number.
  const accessibilityLabel = [label, String(value), description]
    .filter(Boolean)
    .join(", ");

  if (compact) {
    // Two cards to a 360–430px row leave roughly 100px beside the icon — not
    // enough for a long label and its caption to sit there unclipped. The icon
    // and the trend pill take the top line instead, so the label, figure and
    // caption each get the card's full width.
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        className={`min-w-0 flex-1 border ${dense ? "p-2.5" : "p-3"}`}
        style={surface}
      >
        <View className="flex-row items-start justify-between gap-2">
          <View
            className={`${dense ? "h-9 w-9" : "h-10 w-10"} shrink-0 items-center justify-center`}
            style={{ backgroundColor: toneStyle.iconBg, borderRadius: 12 }}
          >
            <Feather name={icon} size={dense ? 17 : 19} color={toneStyle.icon} />
          </View>
          {showTrend ? <TrendPill palette={palette} growth={growth as number} compact /> : null}
        </View>

        <Text
          className={`mt-2.5 font-semibold ${dense ? "text-[12px]" : "text-[13px]"}`}
          numberOfLines={1}
          style={{ color: palette.heading }}
        >
          {label}
        </Text>
        <Text
          className={`mt-0.5 font-extrabold ${dense ? "text-[23px]" : "text-[26px]"}`}
          style={{ color: palette.heading, lineHeight: dense ? 29 : 32 }}
        >
          {displayValue.toLocaleString()}
        </Text>
        <Text
          className="mt-0.5 text-[11px] font-medium"
          numberOfLines={1}
          style={{ color: palette.muted }}
        >
          {description}
        </Text>
      </View>
    );
  }

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className="min-w-0 flex-1 flex-row items-center gap-3.5 border p-4"
      style={surface}
    >
      <View
        className="h-12 w-12 shrink-0 items-center justify-center"
        style={{ backgroundColor: toneStyle.iconBg, borderRadius: 14 }}
      >
        <Feather name={icon} size={22} color={toneStyle.icon} />
      </View>

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text
            // Wraps rather than truncates: at 1366px four cards across leave
            // roughly 90px beside the trend pill, which a two-word label does
            // not fit on one line. The row stretches all four to match.
            className="min-w-0 flex-1 text-[14px] font-semibold"
            numberOfLines={2}
            style={{ color: palette.heading }}
          >
            {label}
          </Text>
          {showTrend ? <TrendPill palette={palette} growth={growth as number} /> : null}
        </View>

        <Text
          className="mt-0.5 text-[30px] font-extrabold"
          style={{ color: palette.heading, lineHeight: 36 }}
        >
          {displayValue.toLocaleString()}
        </Text>
        <Text
          className="mt-0.5 text-[12px] font-medium"
          numberOfLines={1}
          style={{ color: palette.muted }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
