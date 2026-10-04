import { Feather } from "@expo/vector-icons";
import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { PALETTE, withAlpha } from "@/theme/palette";

type DetailsModalHeaderProps = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: ReactNode;
  titleId?: string;
  titleSize?: number;
  /** Rendered just before the close button (e.g. a status badge). */
  trailing?: ReactNode;
  closeLabel: string;
  onClose: () => void;
};

/** Header for DetailsModalShell: icon well, large title with subtitle, round close button. */
const DetailsModalHeader = ({
  icon,
  title,
  subtitle,
  titleId,
  titleSize = 24,
  trailing,
  closeLabel,
  onClose,
}: DetailsModalHeaderProps) => {
  const palette = useAdminSurfacePalette();
  const [hovered, setHovered] = useState(false);
  const well = palette.isDark ? withAlpha(PALETTE.blue[600], 0.18) : PALETTE.blue[50];
  const iconColor = palette.isDark ? PALETTE.blue[300] : PALETTE.blue[600];

  return (
    <View className="w-full flex-row items-start justify-between gap-4">
      <View className="min-w-0 flex-1 flex-row items-center gap-3.5">
        <View className="h-11 w-11 items-center justify-center" style={{ borderRadius: 12, backgroundColor: well }}>
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            nativeID={titleId}
            accessibilityRole="header"
            className="font-bold"
            style={{ fontSize: titleSize, color: palette.heading }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-0.5 text-[13.5px]" style={{ color: palette.muted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="shrink-0 flex-row items-center gap-3">
        {trailing ? <View className="justify-center">{trailing}</View> : null}
        <Pressable
          onPress={onClose}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: hovered ? palette.divider : well }}
        >
          <Feather name="x" size={18} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
};

export default DetailsModalHeader;
