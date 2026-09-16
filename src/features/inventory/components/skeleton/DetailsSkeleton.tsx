import { View } from "react-native";
import { CARD_SHADOW, RADIUS, useInventoryPalette } from "../inventoryTheme";
import Bar from "./Bar";

export const DetailsSkeleton = () => {
  const palette = useInventoryPalette();

  return (
    <View
      className="w-full border p-4"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <Bar width="55%" height={14} />
      <View className="mt-4 flex-row items-center gap-3">
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: palette.skeleton }} />
        <View className="min-w-0 flex-1 gap-2">
          <Bar width="70%" height={13} />
          <Bar width="45%" height={10} />
        </View>
      </View>
      <View className="mt-4 gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <View key={index} className="flex-row items-center gap-3">
            <View style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: palette.skeleton }} />
            <Bar width="40%" height={10} />
            <View className="flex-1" />
            <Bar width={64} height={10} />
          </View>
        ))}
      </View>
      <View className="mt-5 flex-row gap-2.5">
        <Bar width="48%" height={44} />
        <Bar width="48%" height={44} />
      </View>
    </View>
  );
};
