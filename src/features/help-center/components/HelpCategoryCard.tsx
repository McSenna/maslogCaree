import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpArticleList from "./HelpArticleList";
import type { HelpCategory } from "../types/helpCenter.types";

type HelpCategoryCardProps = {
  category: HelpCategory;
  expanded: boolean;
  onToggle: (categoryId: string) => void;
};

const HelpCategoryCard = ({ category, expanded, onToggle }: HelpCategoryCardProps) => {
  const palette = useAdminSurfacePalette();
  const tone = palette.tones[category.tone];

  return (
    <View
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderWidth: 1,
        borderColor: expanded ? palette.primary : palette.cardBorder,
        overflow: "hidden",
        ...CARD_SHADOW,
      }}
    >
      <Pressable
        onPress={() => onToggle(category.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${category.title} help articles`}
        style={{ minHeight: 44, flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16 }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tone.iconBg,
          }}
        >
          <Feather name={category.icon} size={18} color={tone.icon} />
        </View>

        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: palette.heading }}>
            {category.title}
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 19, color: palette.muted }}>
            {category.description}
          </Text>
        </View>

        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={palette.subtle}
        />
      </Pressable>

      {expanded ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
          <View style={{ height: 1, backgroundColor: palette.divider }} />
          <HelpArticleList articles={category.articles} />
        </View>
      ) : null}
    </View>
  );
};

export default HelpCategoryCard;
