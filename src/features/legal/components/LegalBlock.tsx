import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { ThemeColors } from "@/theme/colors";
import { TYPE } from "@/theme/typography";

import type { LegalBlock as LegalBlockData } from "../types/legalDocument.types";

const BULLET_SIZE = 6;

const BULLET_STYLE = {
  width: BULLET_SIZE,
  height: BULLET_SIZE,
  borderRadius: BULLET_SIZE / 2,
  // Centres the dot on the first line of its item, however long the item runs.
  marginTop: (TYPE.bodyLarge.lineHeight - BULLET_SIZE) / 2,
} as const;

type Props = { block: LegalBlockData; colors: ThemeColors };

const Paragraph = ({ text, colors }: { text: string; colors: ThemeColors }) => (
  <Text style={[TYPE.bodyLarge, { color: colors.body }]}>{text}</Text>
);

const BulletList = ({ items, colors }: { items: string[]; colors: ThemeColors }) => (
  <View role="list" className="gap-2">
    {items.map((item) => (
      <View key={item} role="listitem" className="flex-row items-start gap-3">
        <View aria-hidden style={[BULLET_STYLE, { backgroundColor: colors.primary }]} />
        <Text className="min-w-0 flex-1" style={[TYPE.bodyLarge, { color: colors.body }]}>
          {item}
        </Text>
      </View>
    ))}
  </View>
);

/** A fact the barangay still has to supply, shown as a marked gap so nobody mistakes it for a decision. */
const MissingDetail = ({ label, colors }: { label: string; colors: ThemeColors }) => (
  <View
    className="flex-row items-start gap-2 rounded-sm border border-dashed p-3"
    style={{ borderColor: colors.warning.border }}
  >
    <View aria-hidden className="pt-0.5">
      <Feather name="edit-3" size={15} color={colors.warning.fg} />
    </View>
    <Text className="min-w-0 flex-1" style={[TYPE.body, { color: colors.body }]}>
      <Text style={[TYPE.bodyStrong, { color: colors.warning.fg }]}>Not yet provided: </Text>
      {label}
    </Text>
  </View>
);

const LegalBlock = ({ block, colors }: Props) => {
  switch (block.kind) {
    case "paragraph":
      return <Paragraph text={block.text} colors={colors} />;
    case "list":
      return <BulletList items={block.items} colors={colors} />;
    case "missing":
      return <MissingDetail label={block.label} colors={colors} />;
  }
};

export default LegalBlock;
