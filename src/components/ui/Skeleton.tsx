import { useEffect, useRef } from "react";
import { Animated, View, type ViewProps } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type SkeletonProps = ViewProps & {
  className?: string;
};

export function Skeleton({ className = "", style, ...rest }: SkeletonProps) {
  const { classes } = useTheme();
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.85,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      {...rest}
      style={[{ opacity }, style]}
      className={["overflow-hidden rounded-xl", classes.skeleton, className].join(" ")}
    />
  );
}

export function StatCardSkeleton() {
  const { classes } = useTheme();
  return (
    <View className={["gap-3 p-4 md:p-5", classes.card].join(" ")}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20" />
        </View>
        <Skeleton className="h-11 w-11 rounded-2xl" />
      </View>
      <Skeleton className="h-3 w-full" />
    </View>
  );
}

/** Matches resident dashboard structure to avoid layout shift when data arrives */
export function ResidentDashboardSkeleton() {
  const { classes } = useTheme();
  return (
    <View className="gap-7">
      <View className={["flex-row items-center gap-3 rounded-2xl border p-4", classes.card].join(" ")}>
        <Skeleton className="h-14 w-14 rounded-full" />
        <View className="min-w-0 flex-1 gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-44 max-w-full" />
        </View>
        <Skeleton className="h-10 w-10 shrink-0 rounded-2xl" />
      </View>
      <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
      <View className={["gap-3 p-4 md:p-5", classes.card].join(" ")}>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-full max-w-md self-start" />
        <Skeleton className="h-16 w-full" />
      </View>
      <View className="gap-4 md:grid md:grid-cols-2 md:gap-5">
        <View className={["gap-3 p-4 md:p-5", classes.card].join(" ")}>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-28 w-full" />
        </View>
        <View className="gap-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </View>
      </View>
    </View>
  );
}
