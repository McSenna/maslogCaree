import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export type ProfileMenuItemProps = {
  label: string;
  icon: ReactNode;
  onPress?: () => void;
  variant?: "default" | "danger";
};

export default function ProfileMenuItem({
  label,
  icon,
  onPress,
  variant = "default",
}: ProfileMenuItemProps) {
  const isDanger = variant === "danger";

  return (
    <Pressable
      onPress={onPress}
      className="w-full rounded-2xl bg-white px-4 py-3 shadow-sm shadow-slate-200"
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="rounded-2xl bg-sky-50 p-2">{icon}</View>
          <Text
            className={`text-sm font-medium ${
              isDanger ? "text-rose-600" : "text-slate-800"
            }`}
          >
            {label}
          </Text>
        </View>
        <Text className="text-base text-slate-300">›</Text>
      </View>
    </Pressable>
  );
}

