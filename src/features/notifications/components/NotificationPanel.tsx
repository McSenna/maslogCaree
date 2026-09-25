import React, { useCallback, useState } from "react";
import { Animated, Modal, Pressable, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { createShadow } from "@/design/shadow";
import { useNotificationActions } from "../hooks/useNotificationActions";
import { getNotificationsRoute } from "../notification.routes";
import { NOTIFICATION_RADIUS, useNotificationPalette } from "../notification.theme";
import type { BellPosition, NotificationFilter } from "../notification.types";
import NotificationListView from "./NotificationListView";
import NotificationPanelFooter from "./panel/NotificationPanelFooter";
import NotificationPanelHeader from "./panel/NotificationPanelHeader";
import { resolvePanelPlacement } from "./panel/panelPlacement";
import { usePanelAnimation } from "./panel/usePanelAnimation";

const LIST_CONTENT_STYLE = { paddingBottom: 4 } as const;

type NotificationPanelProps = {
  visible: boolean;
  onClose: () => void;
  bellPosition: BellPosition | null;
};

const NotificationPanel = ({ visible, onClose, bellPosition }: NotificationPanelProps) => {
  const { width, height } = useWindowDimensions();
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    error,
    refresh,
    loadMore,
    markAllRead,
  } = useNotificationsContext();
  const { user } = useAuth();
  const palette = useNotificationPalette();
  const router = useGuardedNavigation();
  const insets = useSafeAreaInsets();

  const [filter, setFilter] = useState<NotificationFilter>("all");
  const { opacity, translateY, scale, modalVisible, animateClose } = usePanelAnimation(visible, onClose);
  const { handlePress, isNavigable } = useNotificationActions({ onBeforeNavigate: animateClose });

  useWebModalBehavior(modalVisible, animateClose);
  const attachFocusTrap = useFocusTrap(modalVisible);

  const placement = resolvePanelPlacement(width, height, bellPosition, insets.bottom);
  const visibleItems = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;
  const allRoute = getNotificationsRoute(user?.role);

  const handleViewAll = useCallback(() => {
    animateClose();
    if (allRoute) router.push(allRoute);
  }, [allRoute, animateClose, router]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) void loadMore();
  }, [hasMore, loadingMore, loadMore]);

  if (!visible && !modalVisible) return null;

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={animateClose} statusBarTranslucent>
      <Animated.View style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, opacity }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
          onPress={animateClose}
          style={{ flex: 1, backgroundColor: palette.scrim }}
        />
      </Animated.View>

      <Animated.View
        ref={attachFocusTrap as never}
        accessibilityViewIsModal
        style={{
          position: "absolute",
          top: placement.top,
          right: placement.right,
          width: placement.width,
          maxHeight: placement.maxHeight,
          opacity,
          transformOrigin: "top right",
          transform: [{ translateY }, { scale }],
        }}
      >
        <View
          style={{
            maxHeight: placement.maxHeight,
            overflow: "hidden",
            borderRadius: NOTIFICATION_RADIUS.panel,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.surface,
            ...createShadow({ color: "#0F172A", offsetY: 16, radius: 40, opacity: 0.16, elevation: 20 }),
          }}
        >
          <NotificationPanelHeader
            unreadCount={unreadCount}
            totalCount={notifications.length}
            filter={filter}
            onChangeFilter={setFilter}
            onMarkAllRead={() => void markAllRead()}
            onClose={animateClose}
          />

          <View style={{ flexShrink: 1, minHeight: 0 }}>
            <NotificationListView
              items={visibleItems}
              filter={filter}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              error={error}
              compact
              isNavigable={isNavigable}
              onPressItem={handlePress}
              onRetry={() => void refresh()}
              onEndReached={handleEndReached}
              contentContainerStyle={LIST_CONTENT_STYLE}
            />
          </View>

          {allRoute ? <NotificationPanelFooter onPress={handleViewAll} /> : null}
        </View>
      </Animated.View>
    </Modal>
  );
};

export default React.memo(NotificationPanel);
