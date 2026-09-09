import { Text, View } from "react-native";
import type { UserStatus } from "@/services/userService";
import { RADIUS, useUsersPalette } from "./usersTheme";

export default function UserStatusBadge({
  status,
  compact = false,
}: {
  status: UserStatus;
  compact?: boolean;
}) {
  const palette = useUsersPalette();
  const tone = palette.statuses[status] ?? palette.statuses.pending;

  return (
    // The dot is decorative; the label carries the meaning, so status is never
    // communicated by colour alone.
    <View
      accessibilityRole="text"
      accessibilityLabel={`Status: ${tone.label}`}
      className={`flex-row items-center self-start ${compact ? "gap-1.5 px-2 py-1" : "gap-1.5 px-2.5 py-1.5"}`}
      style={{ backgroundColor: tone.bg, borderRadius: RADIUS.pill }}
    >
      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tone.dot }} />
      <Text
        className={compact ? "text-[11px] font-semibold" : "text-[12px] font-semibold"}
        style={{ color: tone.text }}
      >
        {tone.label}
      </Text>
    </View>
  );
}
