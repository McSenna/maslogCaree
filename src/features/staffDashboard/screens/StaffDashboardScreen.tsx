import { useCallback } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { DashboardErrorState } from "@/components/dashboard/admin";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useStaffDashboard } from "@/hooks/useStaffDashboard";
import StaffDashboardBody from "../components/StaffDashboardBody";
import StaffDashboardSkeleton from "../components/StaffDashboardSkeleton";
import { getRoleDashboardConfig, type StaffRole } from "../config/roleDashboardConfig";
import { useStaffDashboardLayout } from "../hooks/useStaffDashboardLayout";

const StaffDashboardScreen = ({ role }: { role: StaffRole }) => {
  const router = useGuardedNavigation();
  const { resolvedTheme } = useTheme();
  const palette = getAdminDashboardPalette(resolvedTheme);

  const layout = useStaffDashboardLayout();
  const { data, loading, refreshing, error, reload, refresh } = useStaffDashboard();

  const config = getRoleDashboardConfig(role);

  const onViewQueue = useCallback(
    () => router.push(config.queueRoute as never),
    [router, config.queueRoute]
  );

  return (
    <View className="flex-1">
      <RoleScreenBackdrop color={palette.pageBg} insets={layout.insets} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: layout.insets.gutter,
          paddingTop: layout.insets.paddingTop,
          paddingBottom: layout.insets.paddingBottom,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
      >
        <View
          style={{ width: "100%", alignSelf: "center", minWidth: 0 }}
          onLayout={layout.measure}
        >
          <View style={{ gap: layout.isMobile ? 16 : 20 }}>
            {error && data ? (
              <DashboardErrorState
                palette={palette}
                onRetry={refresh}
                retrying={refreshing}
                message={error}
                variant="banner"
              />
            ) : null}

            {loading && !data ? (
              <StaffDashboardSkeleton
                palette={palette}
                metricColumns={layout.metricColumns}
                twoPanelRow={layout.chartSideBySide}
                wideLayout={layout.wideLayout}
                gap={layout.gap}
                showSplit={config.showServiceSplit}
              />
            ) : null}

            {error && !data && !loading ? (
              <DashboardErrorState palette={palette} onRetry={reload} message={error} />
            ) : null}

            {data ? (
              <StaffDashboardBody
                palette={palette}
                config={config}
                data={data}
                layout={layout}
                onViewQueue={onViewQueue}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StaffDashboardScreen;
