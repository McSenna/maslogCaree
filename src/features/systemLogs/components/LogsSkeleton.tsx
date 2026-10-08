import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSystemLogsPalette } from "./systemLogsTheme";

export const MobileLogCardSkeleton = ({ count = 5 }: { count?: number }) => {
  const palette = useSystemLogsPalette();

  return (
    <View className="w-full gap-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className="flex-row items-center gap-3 rounded-lg border p-3.5"
          style={{ backgroundColor: palette.cardBg, borderColor: palette.cardBorder }}
        >
          <Skeleton className="h-9 w-9 rounded-xl" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-3.5 w-2/3 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </View>
        </View>
      ))}
    </View>
  );
};
