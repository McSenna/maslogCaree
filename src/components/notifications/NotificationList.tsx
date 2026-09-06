import React, { useCallback } from "react";
import { FlatList, type ListRenderItem } from "react-native";
import type { NotificationItem as NotificationItemType } from "./notification.types";
import NotificationItemComponent from "./NotificationItem";
import NotificationEmptyState from "./NotificationEmptyState";
import NotificationSkeleton from "./NotificationSkeleton";
import NotificationErrorState from "./NotificationErrorState";

type NotificationListProps = {
  items: NotificationItemType[];
  loading: boolean;
  error: string | null;
  onPressItem: (id: string) => void;
  onRetry: () => void;
};

const keyExtractor = (item: NotificationItemType) => item.id;

const NotificationList = ({
  items,
  loading,
  error,
  onPressItem,
  onRetry,
}: NotificationListProps) => {
  const renderItem: ListRenderItem<NotificationItemType> = useCallback(
    ({ item }) => (
      <NotificationItemComponent item={item} onPress={onPressItem} />
    ),
    [onPressItem]
  );

  // Loading state
  if (loading && items.length === 0) {
    return <NotificationSkeleton />;
  }

  // Error state
  if (error && items.length === 0) {
    return <NotificationErrorState message={error} onRetry={onRetry} />;
  }

  // Empty state
  if (items.length === 0) {
    return <NotificationEmptyState />;
  }

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
    />
  );
};

export default React.memo(NotificationList);
