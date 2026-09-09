import { useCallback, useState } from "react";
import { View } from "react-native";
import {
  NotificationBell,
  NotificationPanel,
  type BellPosition,
} from "@/components/notifications";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { getHeaderPalette } from "./headerTokens";

type HeaderNotificationsProps = {
  compact: boolean;
  isDark: boolean;
};

/**
 * Header bell + the existing notification panel.
 *
 * Owns the notification state so the layouts that render the header do not
 * have to duplicate it.
 */
const HeaderNotifications = ({ compact, isDark }: HeaderNotificationsProps) => {
  const palette = getHeaderPalette(isDark);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  } = useNotificationsContext();

  const [open, setOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState<BellPosition | null>(null);

  const handleMeasure = useCallback((pos: BellPosition) => {
    setBellPosition(pos);
  }, []);

  return (
    <View>
      <NotificationBell
        unreadCount={unreadCount}
        onPress={() => setOpen(true)}
        onMeasure={handleMeasure}
        variant="bare"
        indicator="dot"
        iconSize={compact ? 21 : 22}
        hitSize={compact ? 36 : 40}
        color={palette.icon}
        dotRingColor={palette.background}
      />

      <NotificationPanel
        visible={open}
        onClose={() => setOpen(false)}
        items={notifications}
        unreadCount={unreadCount}
        loading={loading}
        error={error}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onRefresh={refresh}
        bellPosition={bellPosition}
      />
    </View>
  );
};

export default HeaderNotifications;
