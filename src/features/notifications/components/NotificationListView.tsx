import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  type ListRenderItem,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useRelativeClock } from "../hooks/useRelativeClock";
import { useNotificationPalette } from "../notification.theme";
import type { NotificationFilter, NotificationItem } from "../notification.types";
import NotificationEmptyState from "./NotificationEmptyState";
import NotificationErrorState from "./NotificationErrorState";
import NotificationGroupHeader from "./NotificationGroupHeader";
import NotificationRow from "./NotificationRow";
import NotificationSkeleton from "./NotificationSkeleton";
import { buildNotificationRows, rowKeyExtractor, type NotificationRowEntry } from "./notificationListData";

type NotificationListViewProps = {
  items: NotificationItem[];
  filter: NotificationFilter;
  loading: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  error: string | null;
  compact?: boolean;
  isNavigable?: (item: NotificationItem) => boolean;
  onPressItem: (item: NotificationItem) => void;
  onRetry: () => void;
  onEndReached?: () => void;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
};

const NotificationListView = ({
  items,
  filter,
  loading,
  loadingMore = false,
  hasMore = false,
  error,
  compact = false,
  isNavigable,
  onPressItem,
  onRetry,
  onEndReached,
  refreshControl,
  contentContainerStyle,
  ListHeaderComponent,
}: NotificationListViewProps) => {
  const palette = useNotificationPalette();
  const now = useRelativeClock(items.length > 0);
  const rows = useMemo(() => buildNotificationRows(items, now), [items, now]);

  const renderItem: ListRenderItem<NotificationRowEntry> = useCallback(
    ({ item: entry }) =>
      entry.kind === "header" ? (
        <NotificationGroupHeader label={entry.label} />
      ) : (
        <NotificationRow
          item={entry.item}
          onPress={onPressItem}
          navigable={isNavigable?.(entry.item) ?? false}
          compact={compact}
          now={now}
        />
      ),
    [compact, isNavigable, now, onPressItem]
  );

  if (loading && items.length === 0) return <NotificationSkeleton rows={compact ? 4 : 6} />;
  if (error && items.length === 0) return <NotificationErrorState onRetry={onRetry} />;

  return (
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={rowKeyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<NotificationEmptyState filter={filter} />}
      ListFooterComponent={
        loadingMore && hasMore ? (
          <View style={{ paddingVertical: 18 }}>
            <ActivityIndicator size="small" color={palette.primary} />
          </View>
        ) : null
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
      initialNumToRender={12}
      windowSize={9}
      removeClippedSubviews={false}
    />
  );
};

export default React.memo(NotificationListView);
