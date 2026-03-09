import { Pressable, Text } from "react-native";

type AnnouncementCardProps = {
  title: string;
  date: string;
  description: string;
  onPress?: () => void;
};

export default function AnnouncementCard({
  title,
  date,
  description,
  onPress,
}: AnnouncementCardProps) {
  return (
    <Pressable
      className="w-full rounded-2xl bg-white/95 p-4 shadow-sm shadow-sky-100 md:p-5"
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.96 : 1,
      })}
    >
      <Text className="text-base font-semibold text-slate-900 md:text-lg">
        {title}
      </Text>
      <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-sky-600">
        {date}
      </Text>
      <Text className="mt-2 text-sm leading-relaxed text-slate-600 md:text-base">
        {description}
      </Text>
    </Pressable>
  );
}

