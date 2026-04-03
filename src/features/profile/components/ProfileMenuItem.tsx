import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProfileMenuItemVariant = "default" | "danger";

export type ProfileMenuItemProps = {
  label: string;
  icon: ReactNode;
  value?: string;
  /** When set, replaces value + chevron (e.g. theme switch). Row is non-pressable so controls receive touches. */
  endSlot?: ReactNode;
  onPress?: () => void;
  variant?: ProfileMenuItemVariant;
  showBorder?: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileMenuItem({
  label,
  icon,
  value,
  endSlot,
  onPress,
  variant = "default",
  showBorder = false,
}: ProfileMenuItemProps) {
  const isDanger = variant === "danger";

  const rowClass = `flex-row items-center justify-between px-4 py-3 ${
    showBorder ? "border-b border-slate-100" : ""
  }`;

  const inner = (
    <>
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

      {endSlot ? (
        endSlot
      ) : (
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
      )}
    </>
  );

  if (endSlot) {
    return <View className={rowClass}>{inner}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
        opacity: !onPress ? 1 : pressed ? 0.85 : 1,
      })}
      className={rowClass}
    >
      {inner}
    </Pressable>
  );
}
