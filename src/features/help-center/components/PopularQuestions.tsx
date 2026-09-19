import { useState } from "react";
import { View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import FAQAccordionItem from "./FAQAccordionItem";
import HelpSectionHeading from "./HelpSectionHeading";
import type { HelpFaq } from "../types/helpCenter.types";

type PopularQuestionsProps = {
  faqs: readonly HelpFaq[];
  title?: string;
};

const PopularQuestions = ({ faqs, title = "Popular Questions" }: PopularQuestionsProps) => {
  const palette = useAdminSurfacePalette();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (faqs.length === 0) return null;

  return (
    <View>
      <HelpSectionHeading title={title} />

      <View
        style={{
          paddingHorizontal: 16,
          borderRadius: RADIUS.card,
          backgroundColor: palette.cardBg,
          borderWidth: 1,
          borderColor: palette.cardBorder,
          ...CARD_SHADOW,
        }}
      >
        {faqs.map((faq) => (
          <FAQAccordionItem
            key={faq.id}
            faq={faq}
            expanded={expandedId === faq.id}
            onToggle={(faqId) =>
              setExpandedId((current) => (current === faqId ? null : faqId))
            }
          />
        ))}
      </View>
    </View>
  );
};

export default PopularQuestions;
