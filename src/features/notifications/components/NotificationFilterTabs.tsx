import { Pressable, Text, View } from "react-native";
import { PROFILE_COLORS, PROFILE_RADIUS } from "@/features/profile";

export type NotificationFilter = "all" | "unread";

type NotificationFilterTabsProps = {
  value: NotificationFilter;
  onChange: (next: NotificationFilter) => void;
  totalCount: number;
  unreadCount: number;
};

/**
 * All / Unread segmented control.
 *
 * Deliberately two options: mobile has room for a clear binary, and the type
 * filters the design allows are better served by search than by a crowded row.
 */
const NotificationFilterTabs = ({
  value,
  onChange,
  totalCount,
  unreadCount,
}: NotificationFilterTabsProps) => {
  const tabs: { key: NotificationFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "unread", label: "Unread", count: unreadCount },
  ];

  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        gap: 4,
        padding: 4,
        borderRadius: PROFILE_RADIUS.control,
        backgroundColor: "#EEF2F7",
      }}
    >
      {tabs.map((tab) => {
        const active = tab.key === value;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={`${tab.label}, ${tab.count}`}
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            className="flex-1 flex-row items-center justify-center gap-1.5 active:opacity-80"
            style={{
              height: 38,
              borderRadius: 9,
              backgroundColor: active ? PROFILE_COLORS.surface : "transparent",
            }}
          >
            <Text
              maxFontSizeMultiplier={1.2}
              style={{
                fontSize: 13.5,
                fontWeight: active ? "700" : "600",
                color: active ? PROFILE_COLORS.primary : PROFILE_COLORS.muted,
              }}
            >
              {tab.label}
            </Text>
            <Text
              maxFontSizeMultiplier={1.2}
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: active ? PROFILE_COLORS.primary : PROFILE_COLORS.subtle,
              }}
            >
              {tab.count}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default NotificationFilterTabs;
