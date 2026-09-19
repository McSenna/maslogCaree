import { useState } from "react";
import { View } from "react-native";

import HelpCategoryCard from "./HelpCategoryCard";
import type { HelpCategory } from "../types/helpCenter.types";

type HelpCategoryGridProps = {
  categories: readonly HelpCategory[];
  expandedCategoryId?: string | null;
  /** Cards wrap intrinsically, so a narrow phone renders one column without measuring. */
  minCardWidth?: number;
};

const HelpCategoryGrid = ({
  categories,
  expandedCategoryId = null,
  minCardWidth = 280,
}: HelpCategoryGridProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(expandedCategoryId);

  const toggle = (categoryId: string) =>
    setExpandedId((current) => (current === categoryId ? null : categoryId));

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {categories.map((category) => (
        <View
          key={category.id}
          style={{ minWidth: 0, flexGrow: 1, flexBasis: minCardWidth, maxWidth: "100%" }}
        >
          <HelpCategoryCard
            category={category}
            expanded={expandedId === category.id}
            onToggle={toggle}
          />
        </View>
      ))}
    </View>
  );
};

export default HelpCategoryGrid;
