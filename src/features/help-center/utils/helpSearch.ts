import { HELP_CATEGORIES } from "../constants/helpCategories.constants";
import { HELP_FAQS } from "../constants/helpFaqs.constants";
import type { HelpCategory, HelpFaq, HelpSearchResult } from "../types/helpCenter.types";

const MIN_QUERY_LENGTH = 2;

const normalize = (value: string) => value.trim().toLowerCase();

const matchesTerms = (haystack: readonly string[], terms: string[]) => {
  const joined = haystack.join(" ").toLowerCase();
  return terms.every((term) => joined.includes(term));
};

const matchCategory = (category: HelpCategory, terms: string[]) =>
  matchesTerms([category.title, category.description, category.id], terms);

const matchFaq = (faq: HelpFaq, terms: string[]) =>
  matchesTerms([faq.question, faq.answer, ...faq.keywords], terms);

export const searchHelpContent = (query: string): HelpSearchResult => {
  const normalized = normalize(query);
  const isSearching = normalized.length >= MIN_QUERY_LENGTH;

  if (!isSearching) {
    return { categories: [], articles: [], faqs: [], isEmpty: false, isSearching: false };
  }

  const terms = normalized.split(/\s+/).filter(Boolean);

  const categories = HELP_CATEGORIES.filter((category) => matchCategory(category, terms));

  const articles = HELP_CATEGORIES.flatMap((category) =>
    category.articles
      .filter((article) =>
        matchesTerms([article.title, article.summary, category.title, ...article.keywords], terms)
      )
      .map((article) => ({ article, categoryTitle: category.title }))
  );

  const faqs = HELP_FAQS.filter((faq) => matchFaq(faq, terms));

  return {
    categories,
    articles,
    faqs,
    isSearching: true,
    isEmpty: categories.length === 0 && articles.length === 0 && faqs.length === 0,
  };
};
