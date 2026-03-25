import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProfileMenuItemVariant = "default" | "danger";

export type ProfileMenuItemProps = {
  label: string;
  icon: ReactNode;
  value?: string;
  onPress?: () => void;
  variant?: ProfileMenuItemVariant;
  showBorder?: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileMenuItem({
  label,
  icon,
  value,
  onPress,
  variant = "default",
  showBorder = false,
}: ProfileMenuItemProps) {
  const isDanger = variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: pressed ? 0.85 : 1,
      })}
      className={`flex-row items-center justify-between px-4 py-3 ${
        showBorder ? "border-b border-slate-100" : ""
      }`}
    >
      {/* Left: icon + label */}
      <View className="flex-row items-center gap-3">
        <View className="h-[34px] w-[34px] items-center justify-center">
          {icon}
        </View>
        <Text
          className={`text-sm font-medium ${
            isDanger ? "text-rose-500" : "text-slate-800"
          }`}
        >
          {label}
        </Text>
      </View>

      {/* Right: optional value + chevron */}
      <View className="flex-row items-center gap-1">
        {value ? (
          <Text className="text-sm text-slate-400">{value}</Text>
        ) : null}
        <Feather
          name="chevron-right"
          size={16}
          color={isDanger ? "#f43f5e" : "#cbd5e1"}
        />
      </View>
    </Pressable>
  );
}