import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpSearch from "./HelpSearch";

type HelpCenterHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

const HelpCenterHeader = ({ query, onQueryChange }: HelpCenterHeaderProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        gap: 14,
        padding: 20,
        borderRadius: RADIUS.card,
        backgroundColor: palette.bannerBg,
        borderWidth: 1,
        borderColor: palette.bannerBorder,
      }}
    >
      <View style={{ gap: 6 }}>
        <Text
          accessibilityRole="header"
          style={{ fontSize: 22, fontWeight: "700", color: palette.heading }}
        >
          MaslogCare Help Center
        </Text>
        <Text style={{ fontSize: 15, fontWeight: "600", color: palette.primary }}>
          How can we help you today?
        </Text>
        <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted }}>
          Find answers, learn how to use MaslogCare, or contact our support team if you need
          additional assistance.
        </Text>
      </View>

      <HelpSearch value={query} onChange={onQueryChange} />
    </View>
  );
};

export default HelpCenterHeader;
