import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
};

export default function QuickActionCard({
  title,
  description,
  icon,
  href,
}: QuickActionCardProps) {
  const CardContent = () => (
    <Pressable
      className="flex-1 rounded-2xl bg-white/95 px-4 py-4 shadow-md shadow-sky-100 active:bg-sky-50"
      android_ripple={{ color: "#E0F2FE", borderless: false }}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.96 : 1,
      })}
    >
      <View className="mb-3 flex-row items-center gap-3">
        <View className="rounded-2xl bg-mc-primary/10 p-2.5">{icon}</View>
        <Text className="flex-1 text-sm font-semibold text-mc-text">
          {title}
        </Text>
      </View>
      <Text className="text-xs leading-relaxed text-slate-600">
        {description}
      </Text>
    </Pressable>
  );

  if (href) {
    return (
      <Link href={href as any} asChild>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}

