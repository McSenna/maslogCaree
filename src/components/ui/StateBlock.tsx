import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type StateBlockProps = {
  icon: keyof typeof Feather.glyphMap;
  tone: "neutral" | "error";
  title: string;
  body: string;
  /** The one thing that resolves this state, when there is one. */
  action?: { label: string; onPress: () => void };
  /**
   * The error tint. Each admin page picks its own red, so it is passed rather
   * than read from a palette that would have to agree across all of them.
   */
  dangerColor?: string;
};

/**
 * Why a list is empty, and what to do about it.
 *
 * Every admin table has the same four outcomes — no permission, no results, no
 * records yet, or a failed load — and they differ only in icon, wording and
 * whether there is an action. Sharing the block is what keeps the spacing and
 * the icon well identical across User Management, Inventory and System Logs.
 */
export default function StateBlock({
  icon,
  tone,
  title,
  body,
  action,
  dangerColor = "#EF4444",
}: StateBlockProps) {
  const palette = useAdminSurfacePalette();
  const isError = tone === "error";

  return (
    <View className="w-full items-center gap-3 px-6 py-14">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: isError ? "#FEE2E2" : palette.divider }}
      >
        <Feather name={icon} size={20} color={isError ? dangerColor : palette.subtle} />
      </View>

      <View className="items-center gap-1">
        <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          {title}
        </Text>
        <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
          {body}
        </Text>
      </View>

      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="h-11 justify-center px-5"
          style={{ borderRadius: RADIUS.control, backgroundColor: palette.primary }}
        >
          <Text className="text-[14px] font-semibold text-white">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
