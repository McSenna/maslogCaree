import { View } from "react-native";
import { CARD_SHADOW, RADIUS, useUsersPalette } from "./usersTheme";
import { USER_COLUMNS } from "./usersTableColumns";

function Bar({ width, height = 10 }: { width: number | `${number}%`; height?: number }) {
  const palette = useUsersPalette();
  return <View style={{ width, height, borderRadius: 6, backgroundColor: palette.skeleton }} />;
}

function MobileCardSkeleton({ dense }: { dense: boolean }) {
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
        <Bar width="55%" height={13} />
        <Bar width="80%" height={10} />
        <View className="flex-row gap-1.5">
          <Bar width={62} height={18} />
          <Bar width={58} height={18} />
        </View>
        <Bar width="50%" height={10} />
      </View>
    </View>
  );
}

function TableRowSkeleton({ isLast }: { isLast: boolean }) {
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
      <View className="items-center px-3" style={{ width: USER_COLUMNS.checkbox }}>
        <Bar width={18} height={18} />
      </View>
      <View className="flex-row items-center gap-2.5 px-3" style={{ flex: USER_COLUMNS.user, minWidth: 0 }}>
        <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: palette.skeleton }} />
        <Bar width="70%" height={12} />
      </View>
      <View className="px-3" style={{ flex: USER_COLUMNS.email, minWidth: 0 }}>
        <Bar width="85%" />
      </View>
      <View className="px-3" style={{ flex: USER_COLUMNS.role, minWidth: 0 }}>
        <Bar width={72} height={22} />
      </View>
      <View className="px-3" style={{ flex: USER_COLUMNS.location, minWidth: 0 }}>
        <Bar width="75%" />
      </View>
      <View className="px-3" style={{ flex: USER_COLUMNS.status, minWidth: 0 }}>
        <Bar width={64} height={22} />
      </View>
      <View className="gap-1.5 px-3" style={{ flex: USER_COLUMNS.lastLogin, minWidth: 0 }}>
        <Bar width="70%" />
        <Bar width="45%" height={9} />
      </View>
      <View className="items-center px-3" style={{ width: USER_COLUMNS.actions }}>
        <Bar width={20} height={20} />
      </View>
    </View>
  );
}

type UsersSkeletonListProps = {
  count?: number;
  /** true = cards (phone), false = table rows (desktop). */
  isMobile?: boolean;
  dense?: boolean;
};

export default function UsersSkeletonList({
  count = 8,
  isMobile = false,
  dense = false,
}: UsersSkeletonListProps) {
  if (isMobile) {
    return (
      <View className="w-full gap-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <MobileCardSkeleton key={i} dense={dense} />
        ))}
      </View>
    );
  }

  return (
    <View className="w-full">
      {Array.from({ length: count }).map((_, i) => (
        <TableRowSkeleton key={i} isLast={i === count - 1} />
      ))}
    </View>
  );
}
