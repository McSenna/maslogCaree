import { View } from "react-native";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "../usersTheme";
import { REQUEST_COLUMNS } from "./userRequestsColumns";

const Bar = ({ width, height = 10 }: { width: number | `${number}%`; height?: number }) => {
  const palette = useUsersPalette();
  return <View style={{ width, height, borderRadius: 6, backgroundColor: palette.skeleton }} />;
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
        className="flex-row items-center gap-3 px-3"
        style={{ flex: REQUEST_COLUMNS.resident, minWidth: 0 }}
      >
        <View
          style={{ width: 36, height: 36, borderRadius: 999, backgroundColor: palette.skeleton }}
        />
        <View className="min-w-0 flex-1 gap-1.5">
          <Bar width="65%" height={12} />
          <Bar width="45%" height={9} />
        </View>
      </View>
      <View className="gap-1.5 px-3" style={{ flex: REQUEST_COLUMNS.contact, minWidth: 0 }}>
        <Bar width="80%" />
        <Bar width="55%" height={9} />
      </View>
      <View className="gap-1.5 px-3" style={{ flex: REQUEST_COLUMNS.idType, minWidth: 0 }}>
        <Bar width="70%" />
        <Bar width="50%" height={9} />
      </View>
      <View className="px-3" style={{ flex: REQUEST_COLUMNS.registered, minWidth: 0 }}>
        <Bar width="75%" />
      </View>
      <View className="px-3" style={{ flex: REQUEST_COLUMNS.status, minWidth: 0 }}>
        <Bar width={64} height={22} />
      </View>
      <View className="items-end px-3" style={{ width: REQUEST_COLUMNS.action }}>
        <Bar width={76} height={30} />
      </View>
    </View>
  );
};

const CardSkeleton = ({ dense }: { dense: boolean }) => {
  const palette = useUsersPalette();

  return (
    <View
      className="w-full flex-row items-start gap-3 border p-3.5"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        style={{
          width: dense ? 48 : 54,
          height: dense ? 48 : 54,
          borderRadius: 999,
          backgroundColor: palette.skeleton,
        }}
      />
      <View className="min-w-0 flex-1 gap-2">
        <Bar width="60%" height={13} />
        <Bar width="45%" height={10} />
        <Bar width="100%" height={34} />
        <Bar width="55%" height={10} />
      </View>
    </View>
  );
};

type UserRequestsSkeletonProps = {
  count?: number;
  isMobile?: boolean;
  dense?: boolean;
};

const UserRequestsSkeleton = ({
  count = 6,
  isMobile = false,
  dense = false,
}: UserRequestsSkeletonProps) => {
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

export default UserRequestsSkeleton;
