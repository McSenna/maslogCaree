import { Feather } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import NotificationEmptyState from "@/components/notifications/NotificationEmptyState";
import NotificationErrorState from "@/components/notifications/NotificationErrorState";
import NotificationItem from "@/components/notifications/NotificationItem";
import NotificationSkeleton from "@/components/notifications/NotificationSkeleton";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { PROFILE_COLORS, PROFILE_RADIUS } from "@/features/profile";
import type { NotificationItem as NotificationItemType } from "@/services/notifications";
import NotificationFilterTabs, {
  type NotificationFilter,
} from "../components/NotificationFilterTabs";

const keyExtractor = (item: NotificationItemType) => item.id;

const NotificationsScreen = () => {
  const { notifications, unreadCount, loading, error, refresh, markRead, markAllRead } =
    useNotificationsContext();

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

  const handlePressItem = useCallback(
    (id: string) => {
      const item = notifications.find((n) => n.id === id);
      if (item && !item.isRead) void markRead(id);
    },
    [markRead, notifications]
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationItemType }) => (
      <NotificationItem item={item} onPress={handlePressItem} variant="card" />
    ),
    [handlePressItem]
  );

  const header = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingBottom: 14,
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <NotificationFilterTabs
          value={filter}
          onChange={setFilter}
          totalCount={notifications.length}
          unreadCount={unreadCount}
        />
      </View>

      {unreadCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Mark all ${unreadCount} notifications as read`}
          onPress={() => void markAllRead()}
          className="shrink-0 flex-row items-center gap-1.5 active:opacity-75"
          style={{
            height: 46,
            paddingHorizontal: 12,
            borderRadius: PROFILE_RADIUS.control,
            backgroundColor: PROFILE_COLORS.primarySoft,
          }}
        >
          <Feather name="check-circle" size={14} color={PROFILE_COLORS.primary} />
          <Text style={{ fontSize: 12.5, fontWeight: "700", color: PROFILE_COLORS.primary }}>
            Mark all
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  const empty =
    loading && notifications.length === 0 ? (
      <NotificationSkeleton />
    ) : error && notifications.length === 0 ? (
      <NotificationErrorState message={error} onRetry={() => void refresh()} />
    ) : filter === "unread" ? (
      <NotificationEmptyState
        title="No unread notifications"
        message="You're all caught up."
      />
    ) : (
      <NotificationEmptyState
        title="No notifications yet"
        message="You're all caught up."
      />
    );

  return (
    <View style={{ flex: 1, backgroundColor: PROFILE_COLORS.background }}>
      <FlatList
        data={visible}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 14,
          gap: 10,
          paddingBottom: 20,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={PROFILE_COLORS.primary}
            colors={[PROFILE_COLORS.primary]}
          />
        }
      />
    </View>
  );
};

export default NotificationsScreen;
