import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpSectionHeading from "./HelpSectionHeading";
import type { RoleGuide } from "../types/helpCenter.types";

type RoleGuideSectionProps = {
  guide: RoleGuide;
};

const RoleGuideSection = ({ guide }: RoleGuideSectionProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View>
      <HelpSectionHeading title="Using MaslogCare" description={guide.description} />

      <View
        style={{
          gap: 12,
          padding: 16,
          borderRadius: RADIUS.card,
          backgroundColor: palette.cardBg,
          borderWidth: 1,
          borderColor: palette.cardBorder,
          ...CARD_SHADOW,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: palette.tones.purple.iconBg,
            }}
          >
            <Feather name={guide.icon} size={17} color={palette.tones.purple.icon} />
          </View>
          <Text style={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: "700", color: palette.heading }}>
            {guide.title}
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          {guide.topics.map((topic) => (
            <View key={topic} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
              <Feather name="check" size={15} color={palette.positive} style={{ marginTop: 2 }} />
              <Text style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: 19, color: palette.body }}>
                {topic}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RoleGuideSection;
