import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import {
  DASHBOARD_CARD_SHADOW,
  DASHBOARD_RADIUS,
  type AdminDashboardPalette,
  type MetricTone,
} from "@/design/adminDashboardTheme";
import TrendPill from "./TrendPill";

export type MetricProgress = {
  /** Portion done, e.g. patients seen. */
  value: number;
  /** Whole, e.g. patients on today's list. */
  total: number;
};

export type MetricCardProps = {
  palette: AdminDashboardPalette;
  tone: MetricTone;
  label: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  description: string;
  growth?: number | null;
  /** A thin bar under the description, for counts that are part of a known whole. */
  progress?: MetricProgress;
  compact?: boolean;
  dense?: boolean;
};

const ProgressBar = ({ palette, progress }: { palette: AdminDashboardPalette; progress: MetricProgress }) => {
  const share = progress.total > 0 ? Math.min(1, Math.max(0, progress.value / progress.total)) : 0;
  return (
    <View
      className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: palette.divider }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        className="h-full rounded-full"
        style={{ width: `${Math.round(share * 100)}%`, backgroundColor: palette.statusTones.success.fg }}
      />
    </View>
  );
};

/**
 * An overview number. The label sits above the value and the icon keeps to the corner, so values in a
 * row of cards share one left edge and can be compared at a glance.
 */
const MetricCard = ({
  palette,
  tone,
  label,
  value,
  icon,
  description,
  growth,
  progress,
  compact = false,
  dense = false,
}: MetricCardProps) => {
  const toneStyle = palette.tones[tone];
  const showTrend = typeof growth === "number" && Number.isFinite(growth);

  const accessibilityLabel = [
    label,
    value.toLocaleString(),
    description,
    progress && progress.total > 0 ? `${progress.value} of ${progress.total} done` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const iconSize = compact ? (dense ? 30 : 32) : 36;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      className={`min-w-0 flex-1 border ${compact ? (dense ? "p-3" : "p-3.5") : "p-4"}`}
      style={{
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderRadius: DASHBOARD_RADIUS.card,
        ...DASHBOARD_CARD_SHADOW,
      }}
    >
      <View className="flex-row items-start justify-between gap-2">
        <Text
          className={`min-w-0 flex-1 font-semibold ${compact ? "text-[12.5px]" : "text-[13.5px]"}`}
          numberOfLines={compact ? 2 : 1}
          style={{ color: palette.body, lineHeight: compact ? 16 : 18 }}
        >
          {label}
        </Text>
        <View
          className="shrink-0 items-center justify-center"
          style={{ width: iconSize, height: iconSize, borderRadius: 10, backgroundColor: toneStyle.iconBg }}
        >
          <Feather name={icon} size={compact ? 16 : 18} color={toneStyle.icon} />
        </View>
      </View>

      <View className={`flex-row flex-wrap items-center ${compact ? "mt-1" : "mt-1.5"}`} style={{ columnGap: 8 }}>
        <Text
          className={`font-bold ${compact ? (dense ? "text-[22px]" : "text-[24px]") : "text-[30px]"}`}
          style={{
            color: palette.heading,
            lineHeight: compact ? 30 : 36,
            letterSpacing: -0.5,
            fontVariant: ["tabular-nums"],
          }}
        >
          {value.toLocaleString()}
        </Text>
        {showTrend ? <TrendPill palette={palette} growth={growth as number} compact={compact} /> : null}
      </View>

      <Text
        className={compact ? "text-[12px] font-medium" : "text-[12.5px] font-medium"}
        numberOfLines={1}
        style={{ color: palette.muted }}
      >
        {description}
      </Text>

      {progress ? <ProgressBar palette={palette} progress={progress} /> : null}
    </View>
  );
};

export default MetricCard;
