import { Pressable, Text, View } from "react-native";

import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import { useThemeColors } from "@/hooks/useThemeColors";

import type { Announcement } from "../../adminAnnouncement.types";

type Props = { item: Announcement; expanded: boolean; onToggle: (id: string) => void };

/** The title opens and closes the full message; the line under it previews the message. */
const AnnouncementTitle = ({ item, expanded, onToggle }: Props) => {
  const colors = useThemeColors();
  return (
    <View className="min-w-0 gap-0.5 self-stretch">
      <Pressable
        onPress={() => onToggle(item.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        aria-expanded={expanded}
        accessibilityHint={expanded ? "Hides the full message" : "Shows the full message"}
        className="max-w-full self-start web:cursor-pointer"
      >
        {({ hovered, pressed }) => (
          <Text
            numberOfLines={1}
            style={[
              TABLE_TEXT.primary,
              { color: hovered || pressed ? colors.primary : colors.heading, textDecorationLine: hovered ? "underline" : "none" },
            ]}
          >
            {item.title}
          </Text>
        )}
      </Pressable>
      <Text numberOfLines={1} style={[TABLE_TEXT.secondary, { color: colors.muted }]}>
        {item.body}
      </Text>
    </View>
  );
};

export default AnnouncementTitle;
