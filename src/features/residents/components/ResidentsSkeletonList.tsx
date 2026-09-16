import { View } from "react-native";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "@/features/users/components/usersTheme";
import { RESIDENT_COLUMNS } from "./residentsLayout";

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

const RowSkeleton = ({ isLast }: { isLast: boolean }) => {
  const palette = useUsersPalette();

  return (
    <View
      className="w-full flex-row items-center"
      style={{
        minHeight: 68,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: palette.divider,
      }}
    >
      <View
        className="flex-row items-center gap-2.5 px-3"
        style={{ flex: RESIDENT_COLUMNS.resident, minWidth: 0 }}
      >
        <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: palette.skeleton }} />
        <View className="min-w-0 flex-1 gap-1.5">
          <Bar width="70%" height={12} />
          <Bar width="45%" height={9} />
        </View>
      </View>
      <View className="gap-1.5 px-3" style={{ flex: RESIDENT_COLUMNS.contact, minWidth: 0 }}>
        <Bar width="65%" />
        <Bar width="85%" height={9} />
      </View>
      <View className="px-3" style={{ flex: RESIDENT_COLUMNS.address, minWidth: 0 }}>
        <Bar width="88%" />
      </View>
      <View className="px-3" style={{ flex: RESIDENT_COLUMNS.status, minWidth: 0 }}>
        <Bar width={64} height={22} />
      </View>
      <View className="px-3" style={{ flex: RESIDENT_COLUMNS.registered, minWidth: 0 }}>
        <Bar width="70%" />
      </View>
    </View>
  );
};

type ResidentsSkeletonListProps = {
  count?: number;
  isMobile?: boolean;
  dense?: boolean;
};

const ResidentsSkeletonList = ({
  count = 8,
  isMobile = false,
  dense = false,
}: ResidentsSkeletonListProps) => {
  if (isMobile) {
    return (
      <View className="w-full gap-2.5">
        {Array.from({ length: count }).map((_, index) => (
          <CardSkeleton key={index} dense={dense} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <RowSkeleton key={index} isLast={index === count - 1} />
      ))}
    </View>
  );
};

export default ResidentsSkeletonList;
