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
  description: string;
  growth?: number | null;
  compact?: boolean;
  dense?: boolean;
};

const MetricCard = ({
  palette,
  tone,
  label,
  value,
  icon,
  description,
  growth,
  compact = false,
  dense = false,
}: MetricCardProps) => {
  const toneStyle = palette.tones[tone];
  const showTrend = typeof growth === "number" && Number.isFinite(growth);
  const displayValue = useCountUp(value);

  const surface = {
    backgroundColor: palette.cardBg,
    borderColor: palette.cardBorder,
    borderRadius: DASHBOARD_RADIUS.card,
    ...DASHBOARD_CARD_SHADOW,
  };

  const accessibilityLabel = [label, String(value), description]
    .filter(Boolean)
    .join(", ");

  if (compact) {
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
};

export default MetricCard;
