import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTheme } from "@/contexts/ThemeContext";

function UserCardSkeleton() {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "rounded-2xl border p-4 gap-3",
        classes.border,
        isDark ? "bg-slate-900/80" : "bg-white",
      ].join(" ")}
    >
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 gap-1.5">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-2.5 w-28" />
        </View>
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
      <View className="gap-2">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-5/6" />
        <Skeleton className="h-2.5 w-4/5" />
        <Skeleton className="h-2.5 w-3/4" />
        <Skeleton className="h-2.5 w-2/3" />
      </View>
      <Skeleton className="h-2.5 w-16" />
    </View>
  );
}

function UserTableRowSkeleton() {
  const { classes } = useTheme();
  return (
    <View className={`flex-row border-b ${classes.border} py-3`}>
      <View className="flex-[3] px-3 gap-1.5">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-2.5 w-28" />
      </View>
      <View className="flex-[1.5] px-3 justify-center">
        <Skeleton className="h-2.5 w-12" />
      </View>
      <View className="flex-[3] px-3 gap-1">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-2/3" />
      </View>
      <View className="flex-[2] px-3 justify-center">
        <Skeleton className="h-5 w-16 rounded-full" />
      </View>
      <View className="flex-[2] px-3 justify-center">
        <Skeleton className="h-2.5 w-24" />
      </View>
      <View className="flex-[2] px-3 gap-1">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-2.5 w-16" />
      </View>
      <View className="flex-[2] px-3 gap-1">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="h-2.5 w-16" />
      </View>
    </View>
  );
}

type UsersSkeletonListProps = {
  /** Number of skeleton rows/cards to show */
  count?: number;
  /** true = show card skeletons (mobile), false = show row skeletons (desktop) */
  isMobile?: boolean;
};

export default function UsersSkeletonList({
  count = 5,
  isMobile = false,
}: UsersSkeletonListProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (isMobile) {
    return (
      <View className="gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <UserCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <View className={`overflow-hidden rounded-2xl border ${classes.border}`}>
      {/* Fake header */}
      <View
        className={`flex-row py-2.5 ${isDark ? "bg-slate-800/90" : "bg-slate-50"}`}
      >
        {[3, 1.5, 3, 2, 2, 2, 2].map((flex, i) => (
          <View key={i} className="px-3" style={{ flex }}>
            <Skeleton className="h-2 w-16" />
          </View>
        ))}
      </View>
      {Array.from({ length: count }).map((_, i) => (
        <UserTableRowSkeleton key={i} />
      ))}
    </View>
  );
}
