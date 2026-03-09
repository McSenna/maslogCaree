import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type StatCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
  icon?: ReactNode;
  tone?: "primary" | "neutral";
  onPress?: () => void;
};

export default function StatCard({
  label,
  value,
  helperText,
  icon,
  tone = "neutral",
  onPress,
}: StatCardProps) {
  const toneClasses =
    tone === "primary"
      ? "bg-mc-primary/5 border-mc-primary/20"
      : "bg-white/95 border-slate-100";

  return (
    <Pressable
      className={`w-full rounded-2xl border p-4 shadow-sm shadow-sky-50 md:p-5 ${toneClasses}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.96 : 1,
      })}
    >
      <View className="mb-2 flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </Text>
          <Text className="mt-1 text-2xl font-bold text-mc-text md:text-3xl">
            {value}
          </Text>
        </View>
        {icon && (
          <View className="rounded-2xl bg-mc-primary/10 p-2">{icon}</View>
        )}
      </View>
      {helperText && (
        <Text className="text-xs text-slate-500 md:text-sm">{helperText}</Text>
      )}
    </Pressable>
  );
}

