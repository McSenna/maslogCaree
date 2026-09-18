import { Feather } from "@expo/vector-icons";
import { type ReactNode } from "react";
import { Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";

type Props = {
  palette: ResidentDialogPalette;
  title: string;
  icon: keyof typeof Feather.glyphMap;
  iconColor?: string;
  children: ReactNode;
};

/** One titled card in the medical-details stack. */
export const DetailSection = ({ palette, title, icon, iconColor, children }: Props) => (
  <View
    style={{
      padding: 16,
      borderRadius: 14,
      backgroundColor: palette.card,
      borderColor: palette.border,
      borderWidth: 1,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <Feather name={icon} size={16} color={iconColor ?? palette.accent} />
      <Text
        accessibilityRole="header"
        style={{ fontSize: 15, fontWeight: "700", color: palette.heading }}
      >
        {title}
      </Text>
    </View>
    {children}
  </View>
);

export const KeyValueRow = ({
  palette,
  label,
  value,
}: {
  palette: ResidentDialogPalette;
  label: string;
  value: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    }}
  >
    <Text style={{ fontSize: 13, color: palette.muted, flexShrink: 0 }}>{label}</Text>
    <Text
      style={{
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: palette.heading,
        textAlign: "right",
      }}
    >
      {value}
    </Text>
  </View>
);

export const Paragraph = ({
  palette,
  label,
  value,
  emphasis = false,
}: {
  palette: ResidentDialogPalette;
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <View>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "600",
        color: palette.muted,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      {label}
    </Text>
    <Text
      style={{
        fontSize: 14,
        color: palette.body,
        marginTop: 3,
        lineHeight: 20,
        fontWeight: emphasis ? "600" : "400",
      }}
    >
      {value}
    </Text>
  </View>
);

export default DetailSection;
