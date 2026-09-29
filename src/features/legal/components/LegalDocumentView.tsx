import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import { LEGAL_DRAFT_NOTICE, type LegalBlock, type LegalDocument } from "../legalContent";

type LegalDocumentViewProps = {
  document: LegalDocument;
  /** Hides the big title when a dialog header already names the document. */
  showTitle?: boolean;
};

export const DraftNotice = () => {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="alert"
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        padding: 14,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: colors.warning.border,
        backgroundColor: colors.warning.bg,
      }}
    >
      <Feather name="alert-triangle" size={17} color={colors.warning.fg} style={{ marginTop: 1 }} />
      <Text style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: 20, fontWeight: "600", color: colors.warning.fg }}>
        {LEGAL_DRAFT_NOTICE}
      </Text>
    </View>
  );
};

const Block = ({ block }: { block: LegalBlock }) => {
  const colors = useThemeColors();

  if (block.kind === "paragraph") {
    return <Text style={{ fontSize: 15, lineHeight: 23, color: colors.body }}>{block.text}</Text>;
  }

  if (block.kind === "missing") {
    // A marked gap, never a guess: the barangay supplies this before launch.
    return (
      <View
        accessible
        accessibilityLabel={`Not yet provided: ${block.label}`}
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: RADII.small,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: colors.warning.border,
        }}
      >
        <Feather name="edit-3" size={15} color={colors.warning.fg} style={{ marginTop: 2 }} />
        <Text style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: 20, color: colors.body }}>
          <Text style={{ fontWeight: "700", color: colors.warning.fg }}>Not yet provided: </Text>
          {block.label}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {block.items.map((item) => (
        <View key={item} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <View
            style={{ width: 5, height: 5, borderRadius: 3, marginTop: 9, backgroundColor: colors.primary }}
          />
          <Text style={{ flex: 1, minWidth: 0, fontSize: 15, lineHeight: 23, color: colors.body }}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

/** The body of a legal document; shared by its page and the sign-up dialog. */
const LegalDocumentView = ({ document, showTitle = true }: LegalDocumentViewProps) => {
  const colors = useThemeColors();

  return (
    <View style={{ gap: 28 }}>
      <View style={{ gap: 14 }}>
        {showTitle ? (
          <Text
            role="heading"
            aria-level={1}
            style={{ fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.4, color: colors.heading }}
          >
            {document.title}
          </Text>
        ) : null}
        <Text style={{ fontSize: 16, lineHeight: 24, color: colors.muted }}>{document.summary}</Text>
        <DraftNotice />
      </View>

      {document.sections.map((section) => (
        <View key={section.id} style={{ gap: 12 }}>
          <Text
            role="heading"
            aria-level={2}
            style={{ fontSize: 18, lineHeight: 24, fontWeight: "700", color: colors.heading }}
          >
            {section.heading}
          </Text>
          {section.blocks.map((block, index) => (
            <Block key={`${section.id}-${index}`} block={block} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default LegalDocumentView;
