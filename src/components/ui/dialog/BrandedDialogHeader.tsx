import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import IconButton from "@/components/buttons/IconButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

const ON_PRIMARY_MUTED = "rgba(255,255,255,0.8)";

type BrandedDialogHeaderProps = {
  icon: keyof typeof Feather.glyphMap;
  eyebrow: string;
  title: string;
  description: ReactNode;
  closeLabel: string;
  onClose: () => void;
};

const BrandedDialogHeader = ({ icon, eyebrow, title, description, closeLabel, onClose }: BrandedDialogHeaderProps) => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.scheme === "dark" ? colors.primaryPressed : colors.primary,
        padding: SPACING.xl - 4,
        gap: SPACING.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: SPACING.md }}>
        <View style={{ borderRadius: RADII.medium, backgroundColor: "rgba(255,255,255,0.16)", padding: SPACING.sm }}>
          <Feather name={icon} size={20} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[TYPE.caption, { color: ON_PRIMARY_MUTED, letterSpacing: 1.2, textTransform: "uppercase" }]}>
            {eyebrow}
          </Text>
          <Text accessibilityRole="header" style={[TYPE.headline, { color: "#FFFFFF" }]}>
            {title}
          </Text>
        </View>
        <IconButton icon="x" label={closeLabel} onPress={onClose} tone="inverse" variant="soft" size={36} showTooltip={false} />
      </View>
      <Text style={[TYPE.body, { color: ON_PRIMARY_MUTED }]}>{description}</Text>
    </View>
  );
};

export default BrandedDialogHeader;
