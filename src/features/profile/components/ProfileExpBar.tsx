import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileExpBarProps = {
  /** 0–100 */
  progress?: number;
  level?: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const EXP_GRADIENT_COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileExpBar({
  progress = 62,
  level = 7,
}: ProfileExpBarProps) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="w-6 text-[10px] text-slate-400">exp.</Text>

      {/* Track */}
      <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <LinearGradient
          colors={EXP_GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: "100%" }}
        />
      </View>

      <Text className="text-[10px] text-slate-400">Lv.{level}</Text>
    </View>
  );
}