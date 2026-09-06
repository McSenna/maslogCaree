import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { NotificationPanelProps } from "./notification.types";
import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";

// ── Panel dimensions ──────────────────────────────────────────────────

function getPanelWidth(screenWidth: number): number {
  if (screenWidth >= 1024) return 420;
  if (screenWidth >= 768) return 390;
  return screenWidth - 32;
}

const PANEL_MAX_HEIGHT = 560;
const EDGE_MARGIN = 16;
const ANIMATION_OPEN_MS = 220;
const ANIMATION_CLOSE_MS = 180;

// ── Component ─────────────────────────────────────────────────────────

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
  const { resolvedTheme, classes } = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const isDark = resolvedTheme === "dark";

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  // Track internal modal visibility so we can close-animate before hiding
  const [modalVisible, setModalVisible] = useState(false);

  // ── Open animation ──────────────────────────────────────────────────

  useEffect(() => {
    if (visible) {
      setModalVisible(true);

      // Reset values
      opacity.setValue(0);
      translateY.setValue(-8);
      scale.setValue(0.96);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATION_OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: ANIMATION_OPEN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY, scale]);

  // ── Close animation ─────────────────────────────────────────────────

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -5,
        duration: ANIMATION_CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.97,
        duration: ANIMATION_CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      onClose();
    });
  }, [opacity, translateY, scale, onClose]);

  // ── Panel positioning ───────────────────────────────────────────────

  const panelWidth = getPanelWidth(screenWidth);

  let panelTop = EDGE_MARGIN;
  let panelRight = EDGE_MARGIN;

  if (bellPosition) {
    // Position below the bell
    panelTop = bellPosition.y + bellPosition.height + 8;

    // Align right edge with bell right edge
    panelRight =
      screenWidth - (bellPosition.x + bellPosition.width);
  }

  // Clamp: don't overflow right
  if (panelRight < EDGE_MARGIN) {
    panelRight = EDGE_MARGIN;
  }

  // Clamp: don't overflow left
  const panelLeft = screenWidth - panelRight - panelWidth;
  if (panelLeft < EDGE_MARGIN) {
    panelRight = screenWidth - panelWidth - EDGE_MARGIN;
  }

  // Max height: don't overflow bottom
  const maxHeight = Math.min(
    PANEL_MAX_HEIGHT,
    screenHeight - panelTop - EDGE_MARGIN * 2
  );

  // ── Notification press handler ──────────────────────────────────────

  const destination = (() => {
    const role = user?.role;
    if (!role) return null;
    if (role === "resident") return "/resident/appointments";
    if (
      role === "doctor" ||
      role === "admin" ||
      role === "midwife"
    )
      return `/${role}/mission`;
    return `/${role}/dashboard`;
  })();

  const handlePressItem = useCallback(
    (id: string) => {
      void onMarkRead(id);
      animateClose();
      if (destination) {
        router.push(destination as any);
      }
    },
    [onMarkRead, animateClose, destination, router]
  );

  const handleMarkAllRead = useCallback(() => {
    void onMarkAllRead();
  }, [onMarkAllRead]);

  const handleViewAll = useCallback(() => {
    animateClose();
    // Navigate to a full notifications screen if one exists
    if (destination) {
      router.push(destination as any);
    }
  }, [animateClose, destination, router]);

  // ── Render ──────────────────────────────────────────────────────────

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
        {/* Backdrop */}
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0"
          style={{ backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)" }}
          onPress={animateClose}
          accessibilityRole="button"
          accessibilityLabel="Close notifications"
        />

        {/* Floating panel */}
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
              isDark
                ? "border-slate-700/60 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
            style={{
              maxHeight,
              // Additional shadow for depth
              shadowColor: "#0f172a",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.4 : 0.12,
              shadowRadius: 24,
              elevation: 16,
            }}
          >
            {/* Header */}
            <NotificationHeader
              unreadCount={unreadCount}
              hasItems={items.length > 0}
              onMarkAllRead={handleMarkAllRead}
              onClose={animateClose}
            />

            {/* Notification list */}
            <View style={{ flex: 1, maxHeight: maxHeight - 120 }}>
              <NotificationList
                items={items}
                loading={loading}
                error={error}
                onPressItem={handlePressItem}
                onRetry={() => void onRefresh()}
              />
            </View>

            {/* Footer: View All */}
            {items.length > 0 && (
              <View
                className={`border-t ${
                  isDark ? "border-slate-700/60" : "border-slate-100"
                }`}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="View all notifications"
                  onPress={handleViewAll}
                  className="flex-row items-center justify-center gap-1.5 py-3"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text
                    className={`text-sm font-semibold ${classes.textAccent}`}
                  >
                    View All Notifications
                  </Text>
                  <Feather
                    name="arrow-right"
                    size={14}
                    color={isDark ? "#38bdf8" : "#0369a1"}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default React.memo(NotificationPanel);
