import { Text, View } from "react-native";

type AnnouncementSectionLabelProps = {
  label: string;
  /** Blue marks the next event; slate marks the rest. */
  accent: "blue" | "slate";
  isTablet: boolean;
};

/** A small ruled heading above a group of announcements. */
export default function AnnouncementSectionLabel({
  label,
  accent,
  isTablet,
}: AnnouncementSectionLabelProps) {
  return (
    <View className="flex-row items-center gap-2 px-1">
      <View
        className={
          accent === "blue" ? "w-1 h-4 rounded-full bg-blue-500" : "w-1 h-4 rounded-full bg-slate-300"
        }
      />
      <Text
        className="font-black uppercase tracking-widest text-slate-400"
        style={{ fontSize: isTablet ? 11 : 9.5 }}
      >
        {label}
      </Text>
    </View>
  );
}
