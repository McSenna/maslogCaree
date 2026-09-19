import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { HelpFaq } from "../types/helpCenter.types";

type FAQAccordionItemProps = {
  faq: HelpFaq;
  expanded: boolean;
  onToggle: (faqId: string) => void;
};

const FAQAccordionItem = ({ faq, expanded, onToggle }: FAQAccordionItemProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}>
      <Pressable
        onPress={() => onToggle(faq.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={faq.question}
        style={{
          minHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingVertical: 14,
        }}
      >
        <Text style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: "600", color: palette.heading }}>
          {faq.question}
        </Text>
        <Feather name={expanded ? "minus" : "plus"} size={17} color={palette.subtle} />
      </Pressable>

      {expanded ? (
        <Text style={{ fontSize: 13, lineHeight: 20, color: palette.muted, paddingBottom: 14 }}>
          {faq.answer}
        </Text>
      ) : null}
    </View>
  );
};

export default FAQAccordionItem;
