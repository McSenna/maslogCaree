import { cssInterop } from "nativewind";
import { Animated, View, type ViewProps } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useSkeletonPulse } from "@/hooks/useSkeletonPulse";

type SkeletonProps = ViewProps & {
  className?: string;
};

// NativeWind doesn't style Animated.View's className out of the box, which left every placeholder
// transparent. Register a dedicated animated view so only skeletons opt in.
const AnimatedBlock = Animated.createAnimatedComponent(View);
cssInterop(AnimatedBlock, { className: "style" });

export const Skeleton = ({ className = "", style, ...rest }: SkeletonProps) => {
  const { classes } = useTheme();
  const opacity = useSkeletonPulse(0.35, 0.85);

  return (
    <AnimatedBlock
      {...rest}
      style={[{ opacity }, style]}
      className={["overflow-hidden rounded-xl", classes.skeleton, className].join(" ")}
    />
  );
};

export const StatCardSkeleton = () => {
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
};

export const ResidentDashboardSkeleton = () => {
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
};
