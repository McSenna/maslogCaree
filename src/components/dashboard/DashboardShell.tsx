import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Screen from "@/components/layout/Screen";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { StatCardSkeleton } from "@/components/ui/Skeleton";

type DashboardShellProps = {
  children: ReactNode;
  loading?: boolean;
  skeleton?: ReactNode;
};

export default function DashboardShell({ children, loading = false, skeleton }: DashboardShellProps) {
  const { resolvedTheme } = useTheme();

  return (
    <ScrollView
      className="flex-1"
      // The admin near-white rather than plain white: the navigator paints its
      // own surface over the shell's, so a dashboard that does not state its
      // ground sits a shade off every other page under the same chrome.
      style={{ backgroundColor: getAdminDashboardPalette(resolvedTheme).pageBg }}
      showsVerticalScrollIndicator={false}
    >
      <Screen className="py-5 md:py-8">
        {loading ? (
          skeleton ?? (
            <View className="gap-4 md:grid md:grid-cols-3 md:gap-5">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </View>
          )
        ) : (
          children
        )}
      </Screen>
    </ScrollView>
  );
}
