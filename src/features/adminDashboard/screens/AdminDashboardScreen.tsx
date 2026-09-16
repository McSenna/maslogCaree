import { useCallback, useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import {
  AdminDashboardSkeleton,
  DashboardErrorState,
  DashboardIntro,
} from "@/components/dashboard/admin";
import { useTheme } from "@/contexts/ThemeContext";
import { getAdminDashboardPalette } from "@/design/adminDashboardTheme";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import DashboardBody from "../components/DashboardBody";
import { MOBILE_ACTIVITY_COUNT, MOBILE_USER_COUNT } from "../constants/dashboardLayout";
import { useAdminDashboardLayout } from "../hooks/useAdminDashboardLayout";

const AdminDashboardScreen = () => {
  const router = useGuardedNavigation();
  const { resolvedTheme } = useTheme();
  const palette = getAdminDashboardPalette(resolvedTheme);
  const isDark = resolvedTheme === "dark";

  const layout = useAdminDashboardLayout();
  const { data, loading, refreshing, error, reload, refresh } = useAdminDashboard();

  const goToUsers = useCallback(() => router.push("/admin/users"), [router]);
  const goToSystemLogs = useCallback(() => router.push("/admin/system-logs"), [router]);

  const { isMobile } = layout;
  const recentUsers = useMemo(() => {
    const list = data?.recentUsers ?? [];
    return isMobile ? list.slice(0, MOBILE_USER_COUNT) : list;
  }, [data?.recentUsers, isMobile]);

  const recentActivities = useMemo(() => {
    const list = data?.recentActivities ?? [];
    return isMobile ? list.slice(0, MOBILE_ACTIVITY_COUNT) : list;
  }, [data?.recentActivities, isMobile]);

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
          style={{ width: "100%", maxWidth: 1920, alignSelf: "center", minWidth: 0 }}
          onLayout={layout.measure}
        >
          <View className={isMobile ? "gap-4" : "gap-5"}>
            <DashboardIntro palette={palette} compact={isMobile} />

            {error && data ? (
              <DashboardErrorState palette={palette} onRetry={reload} variant="banner" />
            ) : null}

            {loading && !data ? (
              <AdminDashboardSkeleton
                palette={palette}
                compact={isMobile}
                metricColumns={layout.metricColumns}
                panelColumns={layout.panelColumns}
                gap={layout.gap}
              />
            ) : null}

            {error && !data ? <DashboardErrorState palette={palette} onRetry={reload} /> : null}

            {data ? (
              <DashboardBody
                data={data}
                palette={palette}
                isDark={isDark}
                layout={layout}
                recentUsers={recentUsers}
                recentActivities={recentActivities}
                onViewAllUsers={goToUsers}
                onViewAllActivities={goToSystemLogs}
              />
            ) : null}
          </View>
        </View> 
      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;
