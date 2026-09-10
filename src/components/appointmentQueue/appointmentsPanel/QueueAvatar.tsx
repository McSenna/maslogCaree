import { Text, View } from "react-native";
import { initialsOf, type QueuePalette } from "../queueTheme";

/** A patient's initials, where a photo would go. */
export default function QueueAvatar({
  name,
  palette,
}: {
  name: string;
  palette: QueuePalette;
}) {
  return (
    <View
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: palette.primarySoft }}
    >
      <Text className="text-[12px] font-bold" style={{ color: palette.primary }}>
        {initialsOf(name)}
      </Text>
    </View>
  );
}
