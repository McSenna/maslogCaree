import { Feather } from "@expo/vector-icons";
import { Animated, Pressable, Text, View } from "react-native";
import type { AdminDashboardPalette, StatusToneName } from "@/design/adminDashboardTheme";
import { DASHBOARD_CARD_SHADOW, DASHBOARD_RADIUS } from "@/design/adminDashboardTheme";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

export type AttentionItem = {
  key: string;
  icon: keyof typeof Feather.glyphMap;
  tone: Extract<StatusToneName, "warning" | "danger" | "info">;
  /** Leads with the count: "2 registrations to review". */
  title: string;
  /** What resolving it involves: "ID checks waiting for a decision". */
  detail: string;
  onPress: () => void;
};

const ITEM_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "border-color") });

const AttentionCard = ({
  palette,
  item,
  compact,
}: {
  palette: AdminDashboardPalette;
  item: AttentionItem;
  compact: boolean;
}) => {
  const tone = palette.statusTones[item.tone];
  const { hovered, pressed, focused, scaleStyle, handlers } = useInteractionState();
  const active = hovered || pressed;

  return (
    <Animated.View role="listitem" style={[{ flexGrow: 1, flexBasis: compact ? "100%" : 240, minWidth: 0 }, scaleStyle]}>
      <Pressable
        {...handlers}
        onPress={item.onPress}
        accessibilityRole="link"
        accessibilityLabel={`${item.title}. ${item.detail}`}
        style={[
          {
            minHeight: 64,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: DASHBOARD_RADIUS.card - 2,
            borderWidth: 1,
            borderColor: active ? tone.border : palette.cardBorder,
            backgroundColor: active ? palette.hoverBg : palette.cardBg,
            outlineWidth: focused ? 2 : 0,
            outlineStyle: "solid",
            outlineColor: palette.focusRing,
            outlineOffset: 2,
          },
          DASHBOARD_CARD_SHADOW,
          ITEM_WEB,
        ]}
      >
        <View
          className="h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: tone.bg }}
        >
          <Feather name={item.icon} size={18} color={tone.fg} />
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-[14px] font-bold" numberOfLines={1} style={{ color: palette.heading }}>
            {item.title}
          </Text>
          <Text className="text-[12.5px] font-medium" numberOfLines={1} style={{ color: palette.muted }}>
            {item.detail}
          </Text>
        </View>
        <Feather name="chevron-right" size={18} color={active ? tone.fg : palette.subtle} />
      </Pressable>
    </Animated.View>
  );
};

/**
 * Things that are waiting on this person, each linking to the screen that resolves it. Renders nothing
 * when the list is empty, so a quiet day has no "all clear" banner competing with the real content.
 */
const AttentionStrip = ({
  palette,
  items,
  compact,
}: {
  palette: AdminDashboardPalette;
  items: AttentionItem[];
  compact: boolean;
}) => {
  if (items.length === 0) return null;

  return (
    <View
      role="list"
      accessibilityLabel="Needs your attention"
      className="flex-row flex-wrap"
      style={{ gap: compact ? 8 : 12 }}
    >
      {items.map((item) => (
        <AttentionCard key={item.key} palette={palette} item={item} compact={compact} />
      ))}
    </View>
  );
};

export default AttentionStrip;
