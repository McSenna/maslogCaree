import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { classes, resolvedTheme } = useTheme();
  const isFeatured = variant === "featured";

  const surface = isFeatured
    ? "border-transparent bg-mc-primary shadow-lg shadow-mc-primary/35"
    : `${classes.border} ${resolvedTheme === "dark" ? "bg-slate-900/70" : "bg-white"} shadow-sm shadow-black/5`;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      className={`w-full rounded-2xl border p-4 md:p-5 ${surface}`}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.975 : 1 }],
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View className="flex-row items-center gap-4">
        {icon && (
          <View
            className={`rounded-xl p-2.5 ${
              isFeatured ? "bg-white/20" : classes.statIconWrap
            }`}
          >
            {icon}
          </View>
        )}
        <View className="flex-1">
          <Text
            className={`text-base font-bold md:text-lg ${
              isFeatured ? "text-white" : classes.textPrimary
            }`}
          >
            {title}
          </Text>
          {description && (
            <Text
              className={`mt-1 text-sm leading-relaxed md:text-base ${
                isFeatured ? "text-white/80" : classes.textMuted
              }`}
            >
              {description}
            </Text>
          )}
        </View>
        {showArrow && (
          <View
            className={`rounded-full p-2 ${
              isFeatured ? "bg-white/20" : classes.statIconWrap
            }`}
          >
            <Text
              className={`text-sm font-bold ${
                isFeatured ? "text-white" : classes.textAccent
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
