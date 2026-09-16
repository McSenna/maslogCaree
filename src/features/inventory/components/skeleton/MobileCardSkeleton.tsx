import { View } from "react-native";
import { CARD_SHADOW, RADIUS, useInventoryPalette } from "../inventoryTheme";
import Bar from "./Bar";

const MobileCardSkeleton = ({ dense }: { dense: boolean }) => {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full border p-3"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View className="flex-row items-start gap-3">
        <View
          style={{
            width: dense ? 40 : 44,
            height: dense ? 40 : 44,
            borderRadius: 12,
            backgroundColor: palette.skeleton,
          }}
        />
        <View className="min-w-0 flex-1 gap-2">
          <Bar width="60%" height={13} />
          <Bar width="40%" height={10} />
          <View className="flex-row gap-1.5">
            <Bar width={68} height={20} />
            <Bar width={74} height={20} />
          </View>
        </View>
      </View>
      <View className="mt-3 flex-row gap-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
        <View className="flex-1 gap-1.5">
          <Bar width="45%" height={9} />
          <Bar width="70%" height={11} />
        </View>
        <View className="flex-1 gap-1.5">
          <Bar width="55%" height={9} />
          <Bar width="50%" height={11} />
        </View>
      </View>
    </View>
  );
};

export default MobileCardSkeleton;
