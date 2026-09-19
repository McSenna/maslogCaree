import { Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

type HelpSectionHeadingProps = {
  title: string;
  description?: string;
};

const HelpSectionHeading = ({ title, description }: HelpSectionHeadingProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ gap: 4, marginBottom: 12 }}>
      <Text
        accessibilityRole="header"
        style={{ fontSize: 18, fontWeight: "700", color: palette.heading }}
      >
        {title}
      </Text>
      {description ? (
        <Text style={{ fontSize: 13.5, lineHeight: 20, color: palette.muted }}>{description}</Text>
      ) : null}
    </View>
  );
};

export default HelpSectionHeading;
