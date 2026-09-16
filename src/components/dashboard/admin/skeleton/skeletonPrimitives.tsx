import type { ReactNode } from "react";
import { View } from "react-native";

import { Skeleton } from "@/components/ui/Skeleton";
import {
  DASHBOARD_CARD_SHADOW,
  DASHBOARD_RADIUS,
  type AdminDashboardPalette,
} from "@/design/adminDashboardTheme";

export const PanelShell = ({
  palette,
  flex,
  children,
}: {
  palette: AdminDashboardPalette;
  flex?: number;
  children: ReactNode;
}) => {
  return (
    <View
      className="gap-3 rounded-2xl border p-4"
      style={{
        flex,
        minWidth: 0,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      {children}
    </View>
  );
};

export const RowSkeleton = ({ circle = 36 }: { circle?: number }) => {
  return (
    <View className="flex-row items-center gap-3 py-2">
      <Skeleton style={{ width: circle, height: circle, borderRadius: circle / 2 }} />
      <View className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-1/2" />
      </View>
    </View>
  );
};

export const MetricSkeleton = ({ palette }: { palette: AdminDashboardPalette }) => {
  return (
    <View
      className="flex-row items-center gap-3.5 border p-4"
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        borderRadius: DASHBOARD_RADIUS.card,
        ...DASHBOARD_CARD_SHADOW,
      }}
    >
      <Skeleton style={{ width: 48, height: 48, borderRadius: 14 }} />
      <View className="min-w-0 flex-1 gap-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-2.5 w-20" />
      </View>
    </View>
  );
};
