import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useUserDetailsPalette } from "../detailsTheme";

type Props = { titleId: string; onClose: () => void };

const UserSheetHeader = ({ titleId, onClose }: Props) => {
  const palette = useUserDetailsPalette();

  return (
    <View
      className="flex-row items-center justify-between gap-3 px-4 pb-3 pt-1"
      style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
    >
      <View className="min-w-0 flex-1">
        <Text
          nativeID={titleId}
          accessibilityRole="header"
          className="text-[17px] font-bold"
          style={{ color: palette.heading }}
        >
          User Details
        </Text>
        <Text className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
          Account information and access
        </Text>
      </View>

      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close user details"
        hitSlop={14}
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: palette.headerWell }}
      >
        <Feather name="x" size={17} color={palette.headerIcon} />
      </Pressable>
    </View>
  );
};

export default UserSheetHeader;
