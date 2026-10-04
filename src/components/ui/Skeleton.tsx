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
        <Skeleton className="h-11 w-11 rounded-lg" />
      </View>
      <Skeleton className="h-3 w-full" />
    </View>
  );
};
