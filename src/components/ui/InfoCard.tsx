import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type InfoCardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  variant?: "default" | "featured";
};

export default function InfoCard({
  title,
  description,
  icon,
  onPress,
  showArrow = false,
  variant = "default",
}: InfoCardProps) {
  const isFeatured = variant === "featured";

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      className={`w-full rounded-2xl p-4 md:p-5 ${
        isFeatured
          ? "bg-mc-primary shadow-lg shadow-mc-primary/30"
          : "bg-white shadow-sm shadow-slate-200 border border-slate-100"
      }`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.975 : 1 }],
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View className="flex-row items-center gap-4">
        {icon && (
          <View
            className={`rounded-xl p-2.5 ${
              isFeatured ? "bg-white/20" : "bg-mc-primary/8"
            }`}
          >
            {icon}
          </View>
        )}
        <View className="flex-1">
          <Text
            className={`text-base font-bold md:text-lg ${
              isFeatured ? "text-white" : "text-slate-800"
            }`}
          >
            {title}
          </Text>
          {description && (
            <Text
              className={`mt-1 text-sm leading-relaxed md:text-base ${
                isFeatured ? "text-white/80" : "text-slate-500"
              }`}
            >
              {description}
            </Text>
          )}
        </View>
        {showArrow && (
          <View
            className={`rounded-full p-2 ${
              isFeatured ? "bg-white/20" : "bg-mc-primary/8"
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                isFeatured ? "text-white" : "text-mc-primary"
              }`}
            >
              →
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}