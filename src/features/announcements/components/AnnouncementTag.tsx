import { Text, View } from "react-native";

type AnnouncementTagProps = {
  label: string;
  color: string;
  background: string;
  fontSize: number;
  /** The featured card's tags sit slightly wider than the list card's. */
  wide?: boolean;
};

/** The category pill on an announcement. */
export default function AnnouncementTag({
  label,
  color,
  background,
  fontSize,
  wide = false,
}: AnnouncementTagProps) {
  return (
    <View
      className={wide ? "rounded-full px-2.5 py-0.5" : "rounded-full px-2 py-0.5"}
      style={{ backgroundColor: background }}
    >
      <Text className="font-black uppercase tracking-wide" style={{ color, fontSize }}>
        {label}
      </Text>
    </View>
  );
}
