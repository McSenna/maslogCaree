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

const DashboardShell = ({ children, loading = false, skeleton }: DashboardShellProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <ScrollView
      className="flex-1"
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
};

export default DashboardShell;
