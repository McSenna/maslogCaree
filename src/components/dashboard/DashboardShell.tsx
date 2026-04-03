import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Screen from "@/components/layout/Screen";
import { useTheme } from "@/contexts/ThemeContext";
import { StatCardSkeleton } from "@/components/ui/Skeleton";

type DashboardShellProps = {
  children: ReactNode;
  /** When true, shows skeleton instead of children (no artificial delay). */
  loading?: boolean;
  skeleton?: ReactNode;
};

export default function DashboardShell({ children, loading = false, skeleton }: DashboardShellProps) {
  const { classes } = useTheme();

  return (
    <ScrollView
      className={`flex-1 ${classes.scrollBg}`}
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
