import React, { useCallback } from "react";
import { Animated, Modal, Pressable, View, useWindowDimensions } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useGuardedNavigation } from "@/hooks/useGuardedNavigation";

import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import type { NotificationPanelProps } from "./notification.types";
import ViewAllFooter from "./panel/ViewAllFooter";
import { notificationDestination, resolvePanelPlacement } from "./panel/panelPlacement";
import { usePanelAnimation } from "./panel/usePanelAnimation";

const NotificationPanel = ({
  visible,
  onClose,
  items,
  unreadCount,
  loading,
  error,
  onMarkRead,
  onMarkAllRead,
  onRefresh,
  bellPosition,
}: NotificationPanelProps) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { resolvedTheme } = useTheme();
  const router = useGuardedNavigation();
  const { user } = useAuth();

  const isDark = resolvedTheme === "dark";
  const { opacity, translateY, scale, modalVisible, animateClose } = usePanelAnimation(
    visible,
    onClose
  );

  const { panelWidth, panelTop, panelRight, maxHeight } = resolvePanelPlacement(
    screenWidth,
    screenHeight,
    bellPosition
  );

  const destination = notificationDestination(user?.role);

  const handlePressItem = useCallback(
    (id: string) => {
      void onMarkRead(id);
      animateClose();
      if (destination) router.push(destination as any);
    },
    [onMarkRead, animateClose, destination, router]
  );

  const handleViewAll = useCallback(() => {
    animateClose();
    if (destination) router.push(destination as any);
  }, [animateClose, destination, router]);

  if (!visible && !modalVisible) return null;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={animateClose}
      statusBarTranslucent
    >
      <View className="flex-1">
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0"
          style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)" }}
          onPress={animateClose}
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
        />

        <Animated.View
          style={{
            position: "absolute",
            top: panelTop,
            right: panelRight,
            width: panelWidth,
            maxHeight,
            opacity,
            transform: [{ translateY }, { scale }],
          }}
        >
          <View
            className={`overflow-hidden rounded-3xl border shadow-xl ${
              isDark ? "border-slate-700/60 bg-slate-900" : "border-slate-200 bg-white"
            }`}
            style={{
              maxHeight,
              shadowColor: "#0f172a",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.4 : 0.12,
              shadowRadius: 24,
              elevation: 16,
            }}
          >
            <NotificationHeader
              unreadCount={unreadCount}
              hasItems={items.length > 0}
              onMarkAllRead={() => void onMarkAllRead()}
              onClose={animateClose}
            />

            <View style={{ flex: 1, maxHeight: maxHeight - 120 }}>
              <NotificationList
                items={items}
                loading={loading}
                error={error}
                onPressItem={handlePressItem}
                onRetry={() => void onRefresh()}
              />
            </View>

            {items.length > 0 && <ViewAllFooter onPress={handleViewAll} />}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default React.memo(NotificationPanel);
