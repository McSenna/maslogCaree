import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const TITLE_ID = "resident-details-sheet-title";

const ResidentSheetHeader = ({
  onClose,
  palette,
}: {
  onClose: () => void;
  palette: { divider: string; heading: string; muted: string; headerWell: string; headerIcon: string };
}) => (
  <View
    className="flex-row items-center justify-between gap-3 px-4 pb-3 pt-1"
    style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
  >
    <View className="min-w-0 flex-1">
      <Text
        nativeID={TITLE_ID}
        accessibilityRole="header"
        className="text-[17px] font-bold"
        style={{ color: palette.heading }}
      >
        Resident Details
      </Text>
      <Text className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
        Registered resident information
      </Text>
    </View>

    <Pressable
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel="Close resident details"
      hitSlop={14}
      className="h-9 w-9 items-center justify-center rounded-full"
      style={{ backgroundColor: palette.headerWell }}
    >
      <Feather name="x" size={17} color={palette.headerIcon} />
    </Pressable>
  </View>
);

export { TITLE_ID };
export default ResidentSheetHeader;
