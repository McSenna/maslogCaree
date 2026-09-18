import React from "react";
import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { NOTIFICATION_METRICS, NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";

const NotificationSkeleton = ({ rows = 5 }: { rows?: number }) => {
  const palette = useNotificationPalette();

  return (
    <View accessibilityLabel="Loading notifications" style={{ paddingVertical: 4 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: NOTIFICATION_METRICS.rowGap,
            paddingHorizontal: NOTIFICATION_METRICS.rowPaddingX,
            paddingVertical: NOTIFICATION_METRICS.rowPaddingY,
            borderBottomWidth: index === rows - 1 ? 0 : 1,
            borderBottomColor: palette.divider,
          }}
        >
          <Skeleton
            style={{
              width: NOTIFICATION_METRICS.iconSize,
              height: NOTIFICATION_METRICS.iconSize,
              borderRadius: NOTIFICATION_RADIUS.icon,
            }}
          />

          <View style={{ flex: 1, gap: 6, paddingTop: 2 }}>
            <Skeleton style={{ height: 13, width: "55%", borderRadius: 6 }} />
            <Skeleton style={{ height: 11, width: "90%", borderRadius: 6 }} />
            <Skeleton style={{ height: 10, width: 68, borderRadius: 5, marginTop: 2 }} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default React.memo(NotificationSkeleton);
