import { Text, View } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

import type { LegalSection as LegalSectionData } from "../types/legalDocument.types";
import LegalBlock from "./LegalBlock";

type Props = {
  section: LegalSectionData;
  /** Numbered so a resident or the health center can point to "section 4". */
  number: number;
  colors: ThemeColors;
};

const LegalSection = ({ section, number, colors }: Props) => (
  <View className="gap-3">
    <Text role="heading" aria-level={2} style={[TYPE.title, { color: colors.heading }]}>
      <Text style={{ color: colors.muted }}>{number}. </Text>
      {section.heading}
    </Text>
    {section.blocks.map((block, index) => (
      <LegalBlock key={`${section.id}-${index}`} block={block} colors={colors} />
    ))}
  </View>
);

export default LegalSection;
