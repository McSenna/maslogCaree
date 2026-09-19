import type { Feather } from "@expo/vector-icons";
import type { UserRole } from "@/data/mockUsers";

export type HelpIcon = keyof typeof Feather.glyphMap;

export type HelpArticle = {
  id: string;
  title: string;
  summary: string;
  keywords: readonly string[];
  roles?: readonly UserRole[];
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  icon: HelpIcon;
  tone: "blue" | "green" | "pink" | "purple";
  articles: readonly HelpArticle[];
};

export type HelpFaq = {
  id: string;
  question: string;
  answer: string;
  keywords: readonly string[];
};

export type RoleGuide = {
  role: UserRole;
  title: string;
  description: string;
  icon: HelpIcon;
  topics: readonly string[];
};

export type HelpSearchResult = {
  categories: HelpCategory[];
  articles: { article: HelpArticle; categoryTitle: string }[];
  faqs: HelpFaq[];
  isEmpty: boolean;
  isSearching: boolean;
};
