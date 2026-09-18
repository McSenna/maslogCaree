import { useCallback, useState } from "react";
import { View } from "react-native";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import NotificationPanel from "@/features/notifications/components/NotificationPanel";
import type { BellPosition } from "@/features/notifications/notification.types";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { getHeaderPalette } from "./headerTokens";

type HeaderNotificationsProps = {
  compact: boolean;
  isDark: boolean;
};

const HeaderNotifications = ({ compact, isDark }: HeaderNotificationsProps) => {
  const palette = getHeaderPalette(isDark);
  const { unreadCount } = useNotificationsContext();

  const [open, setOpen] = useState(false);
  const [bellPosition, setBellPosition] = useState<BellPosition | null>(null);

  const handleMeasure = useCallback((position: BellPosition) => setBellPosition(position), []);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <View>
      <NotificationBell
        unreadCount={unreadCount}
        onPress={handleOpen}
        onMeasure={handleMeasure}
        indicator="count"
        iconSize={compact ? 21 : 22}
        hitSize={compact ? 36 : 40}
        color={palette.icon}
        ringColor={palette.background}
      />

      <NotificationPanel visible={open} onClose={handleClose} bellPosition={bellPosition} />
    </View>
  );
};

export default HeaderNotifications;
