import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import type { ResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

export type DialogHeaderProps = {
  palette: ResidentDialogPalette;
  title: string;
  subtitle?: string;
  icon: keyof typeof Feather.glyphMap;
  media?: ReactNode;
  tint?: string;
  tintSoft?: string;
  titleId?: string;
  onClose: () => void;
};

export const DialogHeader = ({
  palette,
  title,
  subtitle,
  icon,
  media,
  tint,
  tintSoft,
  titleId,
  onClose,
}: DialogHeaderProps) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: palette.divider,
    }}
  >
    <View style={{ minWidth: 0, flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: media ? undefined : (tintSoft ?? palette.accentSoft),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {media ?? <Feather name={icon} size={17} color={tint ?? palette.accent} />}
      </View>
      <View style={{ minWidth: 0, flex: 1 }}>
        <Text
          nativeID={titleId}
          accessibilityRole="header"
          numberOfLines={2}
          style={{ fontSize: 19, fontWeight: "700", color: palette.heading }}
        >
          {title}
        </Text>
        {subtitle ? <Text style={[TYPE.body, { color: palette.muted }]}>{subtitle}</Text> : null}
      </View>
    </View>

    <Pressable
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={10}
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: palette.card,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Feather name="x" size={18} color={palette.muted} />
    </Pressable>
  </View>
);

export default DialogHeader;
