import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useInventoryPalette } from "../inventoryTheme";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string | null;
  isMobile: boolean;
  onClose: () => void;
};

const InventoryModalHeader = ({
  icon,
  title,
  subtitle,
  isMobile,
  onClose,
}: Props) => {
  const palette = useInventoryPalette();

  return (
    <View
      className={`flex-row items-center gap-3 ${isMobile ? "px-4 pb-3 pt-1" : "px-5 py-4"}`}
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <View
        className="h-10 w-10 items-center justify-center"
        style={{ backgroundColor: palette.bannerBg, borderRadius: 12 }}
      >
        <Feather name={icon} size={19} color={palette.primary} />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          accessibilityRole="header"
          className="text-[16px] font-bold"
          style={{ color: palette.heading }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-[12.5px]" numberOfLines={2} style={{ color: palette.muted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={`Close ${title}`}
        hitSlop={12}
        className="h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.divider }}
      >
        <Feather name="x" size={15} color={palette.muted} />
      </Pressable>
    </View>
  );
};

export default InventoryModalHeader;
