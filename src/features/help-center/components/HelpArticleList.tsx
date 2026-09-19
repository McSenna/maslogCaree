import { Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { HelpArticle } from "../types/helpCenter.types";

type HelpArticleListProps = {
  articles: readonly HelpArticle[];
};

const HelpArticleList = ({ articles }: HelpArticleListProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ gap: 12 }}>
      {articles.map((article) => (
        <View key={article.id} style={{ gap: 3 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: palette.heading }}>
            {article.title}
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 19, color: palette.muted }}>
            {article.summary}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default HelpArticleList;
