import { Text, View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpCategoryGrid from "./HelpCategoryGrid";
import HelpEmptyState from "./HelpEmptyState";
import HelpSectionHeading from "./HelpSectionHeading";
import PopularQuestions from "./PopularQuestions";
import type { HelpSearchResult } from "../types/helpCenter.types";

type HelpSearchResultsProps = {
  results: HelpSearchResult;
  onContactSupport: () => void;
};

const HelpSearchResults = ({ results, onContactSupport }: HelpSearchResultsProps) => {
  const palette = useAdminSurfacePalette();

  if (results.isEmpty) return <HelpEmptyState onContactSupport={onContactSupport} />;

  return (
    <View style={{ gap: 20 }}>
      {results.categories.length > 0 ? (
        <View>
          <HelpSectionHeading title="Matching categories" />
          <HelpCategoryGrid categories={results.categories} />
        </View>
      ) : null}

      {results.articles.length > 0 ? (
        <View>
          <HelpSectionHeading title={`Matching articles (${results.articles.length})`} />
          <View
            style={{
              gap: 14,
              padding: 16,
              borderRadius: RADIUS.card,
              backgroundColor: palette.cardBg,
              borderWidth: 1,
              borderColor: palette.cardBorder,
              ...CARD_SHADOW,
            }}
          >
            {results.articles.map(({ article, categoryTitle }) => (
              <View key={`${categoryTitle}-${article.id}`} style={{ gap: 3 }}>
                <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.primary }}>
                  {categoryTitle.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: "600", color: palette.heading }}>
                  {article.title}
                </Text>
                <Text style={{ fontSize: 13, lineHeight: 19, color: palette.muted }}>
                  {article.summary}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <PopularQuestions faqs={results.faqs} title="Matching questions" />
    </View>
  );
};

export default HelpSearchResults;
