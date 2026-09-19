import { useLocalSearchParams } from "expo-router";

import { findHelpCategory } from "../constants/helpCategories.constants";
import { useHelpSupportOverlay } from "./useHelpSupportOverlay";

export const useHelpCenterScreen = () => {
  const { category } = useLocalSearchParams<{ category?: string }>();

  return {
    overlay: useHelpSupportOverlay(),
    expandedCategoryId: findHelpCategory(category)?.id ?? null,
  };
};
