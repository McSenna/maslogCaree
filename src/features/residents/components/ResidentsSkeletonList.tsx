import { View } from "react-native";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "@/features/users/components/usersTheme";

const Bar = ({ width, height = 10 }: { width: number | `${number}%`; height?: number }) => {
  const palette = useUsersPalette();
  return <View style={{ width, height, borderRadius: 6, backgroundColor: palette.skeleton }} />;
};

const CardSkeleton = ({ dense }: { dense: boolean }) => {
  const palette = useUsersPalette();

  return (
    <View
      className="w-full flex-row items-center gap-3 border p-3"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        style={{
          width: dense ? 52 : 60,
          height: dense ? 52 : 60,
          borderRadius: 999,
          backgroundColor: palette.skeleton,
        }}
      />
      <View className="min-w-0 flex-1 gap-2">
        <Bar width="58%" height={13} />
        <Bar width="34%" height={10} />
        <Bar width={64} height={18} />
        <Bar width="76%" height={10} />
      </View>
    </View>
  );
};

type ResidentsSkeletonListProps = {
  count?: number;
  dense?: boolean;
};

/** Phone placeholders shaped like resident cards; the desktop table draws its own skeleton rows. */
const ResidentsSkeletonList = ({ count = 8, dense = false }: ResidentsSkeletonListProps) => (
  <View className="w-full gap-2.5">
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} dense={dense} />
    ))}
  </View>
);

export default ResidentsSkeletonList;
