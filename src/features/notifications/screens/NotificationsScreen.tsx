import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { RefreshControl, View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import NotificationListView from "../components/NotificationListView";
import NotificationPageHeader from "../components/NotificationPageHeader";
import { useNotificationActions } from "../hooks/useNotificationActions";
import { NOTIFICATION_METRICS, useNotificationPalette } from "../notification.theme";
import type { NotificationFilter } from "../notification.types";

const NotificationsScreen = () => {
  const { notifications, unreadCount, loading, loadingMore, hasMore, error, refresh, loadMore, markAllRead } =
    useNotificationsContext();

  const palette = useNotificationPalette();
  const insets = useRoleScreenInsets();
  const router = useRouter();
  const { handlePress, isNavigable } = useNotificationActions();

  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const visible = useMemo(
    () => (filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications),
    [filter, notifications]
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) void loadMore();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <RoleScreenBackdrop color={palette.background} insets={insets} />

      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: NOTIFICATION_METRICS.pageMaxWidth,
          alignSelf: "center",
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
        }}
      >
        <NotificationPageHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          filter={filter}
          onChangeFilter={setFilter}
          onMarkAllRead={() => void markAllRead()}
          onBack={router.canGoBack() ? router.back : undefined}
        />

        <View style={{ flex: 1 }}>
          <NotificationListView
            items={visible}
            filter={filter}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            error={error}
            isNavigable={isNavigable}
            onPressItem={handlePress}
            onRetry={() => void refresh()}
            onEndReached={handleEndReached}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: insets.isPhone ? 32 : 24,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={palette.primary}
                colors={[palette.primary]}
                progressBackgroundColor={palette.surface}
              />
            }
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationsScreen;
