import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useUserDetailsPalette } from "../../../details/detailsTheme";

type Props = {
  titleId: string;
  busy: boolean;
  onClose: () => void;
};

const VerificationSheetHeader = ({ titleId, busy, onClose }: Props) => {
  const palette = useUserDetailsPalette();

  return (
    <>
      <View className="items-center pb-1 pt-2.5">
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ width: 44, height: 4.5, borderRadius: 3, backgroundColor: palette.divider }}
        />
      </View>

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
            Identity Verification
          </Text>
          <Text className="mt-0.5 text-[12.5px]" style={{ color: palette.muted }}>
            Check the registration against the submitted ID
          </Text>
        </View>

        <Pressable
          onPress={busy ? undefined : onClose}
          accessibilityRole="button"
          accessibilityLabel="Close identity verification"
          hitSlop={14}
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: palette.headerWell }}
        >
          <Feather name="x" size={17} color={palette.headerIcon} />
        </Pressable>
      </View>
    </>
  );
};

export default VerificationSheetHeader;
