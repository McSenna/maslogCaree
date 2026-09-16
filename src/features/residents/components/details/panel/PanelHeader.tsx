import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { DETAIL_RADIUS, useUserDetailsPalette } from "@/features/users/components/details/detailsTheme";

export const TITLE_ID = "resident-details-title";

export const PanelHeader = ({ onClose }: { onClose: () => void }) => {
  const palette = useUserDetailsPalette();
  const [hovered, setHovered] = useState(false);

  return (
    <View className="w-full flex-row items-start justify-between gap-4">
      <View className="min-w-0 flex-1 flex-row items-center gap-3.5">
        <View
          className="h-11 w-11 items-center justify-center"
          style={{ borderRadius: DETAIL_RADIUS.control, backgroundColor: palette.headerWell }}
        >
          <Feather name="user" size={20} color={palette.headerIcon} />
        </View>
        <View className="min-w-0 flex-1">
          <Text
            nativeID={TITLE_ID}
            accessibilityRole="header"
            className="text-[22px] font-bold"
            style={{ color: palette.heading }}
          >
            Resident Details
          </Text>
          <Text className="mt-0.5 text-[13.5px]" style={{ color: palette.muted }}>
            Registered resident information
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onClose}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        accessibilityRole="button"
        accessibilityLabel="Close resident details"
        hitSlop={10}
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: hovered ? palette.divider : palette.headerWell }}
      >
        <Feather name="x" size={18} color={palette.headerIcon} />
      </Pressable>
    </View>
  );
};
