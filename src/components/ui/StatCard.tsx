import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type Trend = {
  label: string;
  direction: "up" | "down" | "neutral";
};

type StatCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: ReactNode;
  tone?: "primary" | "neutral";
  trend?: Trend;
  onPress?: () => void;
};

export default function StatCard({
  label,
  value,
  helperText,
  icon,
  tone = "neutral",
  trend,
  onPress,
}: StatCardProps) {
  const { resolvedTheme, classes } = useTheme();

  const toneClasses =
    tone === "primary"
      ? resolvedTheme === "dark"
        ? "border-sky-500/35 bg-sky-500/10 shadow-sky-950/30"
        : "border-mc-primary/25 bg-mc-primary/5"
      : `${classes.border} ${resolvedTheme === "dark" ? "bg-slate-900/60" : "bg-white"}`;

  const trendColor =
    trend?.direction === "up"
      ? "#34D399"
      : trend?.direction === "down"
        ? "#FB7185"
        : resolvedTheme === "dark"
          ? "#94a3b8"
          : "#64748b";

  const trendIcon =
    trend?.direction === "up"
      ? "trending-up"
      : trend?.direction === "down"
        ? "trending-down"
        : "minus";

  return (
    <Pressable
      className={`w-full rounded-2xl border p-4 shadow-sm md:p-5 ${toneClasses}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.96 : 1,
      })}
    >
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className={`text-xs font-semibold uppercase tracking-[0.18em] ${classes.textMuted}`}>
            {label}
          </Text>
          <Text className={`mt-1 text-2xl font-bold md:text-3xl ${classes.textPrimary}`}>
            {value}
          </Text>
        </View>
        {icon && <View className={`p-2 ${classes.statIconWrap}`}>{icon}</View>}
      </View>
      {trend ? (
        <View className="mt-1 flex-row items-center gap-1">
          <Feather name={trendIcon as keyof typeof Feather.glyphMap} size={14} color={trendColor} />
          <Text className="text-xs font-semibold" style={{ color: trendColor }}>
            {trend.label}
          </Text>
        </View>
      ) : null}
      {helperText ? (
        <Text className={`${trend ? "mt-1" : ""} text-xs md:text-sm ${classes.textMuted}`}>
          {helperText}
        </Text>
      ) : null}
    </Pressable>
  );
}
