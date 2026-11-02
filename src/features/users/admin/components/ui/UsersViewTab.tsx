import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useInteractionState } from "@/hooks/useInteractionState";
import { webTransition } from "@/theme/motion";
import { webStyle } from "@/theme/webStyle";

type UsersViewTabProps = {
  label: string;
  /** Spoken name, when phones show a shorter label. */
  accessibilityLabel: string;
  /** Left off on the narrowest phones, so the label and count are never cut. */
  icon?: keyof typeof Feather.glyphMap;
  count?: number;
  selected: boolean;
  onPress: () => void;
};

const TAB_WEB = webStyle({ cursor: "pointer", transition: webTransition("background-color", "color") });
const COUNT_FIGURES = { fontVariant: ["tabular-nums" as const] };

/** One underlined tab. The underline sits on the row's bottom rule, so the two read as one line. */
const UsersViewTab = ({ label, accessibilityLabel, icon, count, selected, onPress }: UsersViewTabProps) => {
  const palette = useAdminSurfacePalette();
  const { hovered, focused, handlers } = useInteractionState();
  const color = selected ? palette.primary : palette.body;
  const spokenCount = typeof count === "number" ? `, ${count} records` : "";

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      aria-selected={selected}
      accessibilityLabel={`${accessibilityLabel}${spokenCount}`}
      className={`min-h-12 shrink flex-row items-center gap-2 rounded-t-lg ${icon ? "px-3" : "px-2"}`}
      style={{
        marginBottom: -1,
        borderBottomWidth: 2,
        borderBottomColor: selected ? palette.primary : "transparent",
        backgroundColor: hovered && !selected ? palette.hoverBg : "transparent",
        outlineWidth: focused ? 2 : 0,
        outlineStyle: "solid",
        outlineColor: palette.focusRing,
        outlineOffset: -2,
        ...TAB_WEB,
      }}
    >
      {icon ? <Feather name={icon} size={16} color={color} /> : null}
      <Text numberOfLines={1} className={`shrink ${selected ? "font-semibold" : "font-medium"}`} style={{ color, fontSize: 16 }}>
        {label}
      </Text>
      {typeof count === "number" ? (
        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: palette.divider }}>
          <Text className="font-semibold" style={[{ color: palette.body, fontSize: 14 }, COUNT_FIGURES]}>{count.toLocaleString()}</Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export default UsersViewTab;
