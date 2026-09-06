import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";

const SKELETON_ROWS = 4;

/** Skeleton loading placeholder for the notification list. */
const NotificationSkeleton = () => {
  return (
    <View className="px-4 py-2">
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <View
          key={i}
          className="flex-row items-start gap-3 border-b border-slate-100 py-3"
          style={
            i === SKELETON_ROWS - 1
              ? { borderBottomWidth: 0 }
              : undefined
          }
        >
          {/* Icon circle */}
          <Skeleton className="h-10 w-10 rounded-full" />

          {/* Text lines */}
          <View className="flex-1 gap-2 pt-0.5">
            <Skeleton className="h-3 w-3/4 rounded-md" />
            <Skeleton className="h-2.5 w-full rounded-md" />
            <Skeleton className="mt-1 h-2 w-20 rounded-md" />
          </View>
        </View>
      ))}
    </View>
  );
};

export default React.memo(NotificationSkeleton);
