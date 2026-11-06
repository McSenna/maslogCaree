import { useCallback, useState } from "react";
import { Platform, View } from "react-native";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import NotificationPanel from "@/features/notifications/components/NotificationPanel";
import NotificationsModal from "@/features/notifications/components/NotificationsModal";
import type { BellPosition } from "@/features/notifications/notification.types";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useDialogPresentation } from "@/hooks/useDialogPresentation";
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

  // Desktop web shows the full inbox as a centred modal; smaller screens keep the page.
  const presentation = useDialogPresentation();
  const opensModal = Platform.OS === "web" && presentation === "modal";
  const [modalOpen, setModalOpen] = useState(false);
  const handleViewAll = useCallback(() => setModalOpen(true), []);
  const handleModalClose = useCallback(() => setModalOpen(false), []);

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

      <NotificationPanel
        visible={open}
        onClose={handleClose}
        bellPosition={bellPosition}
        onViewAll={opensModal ? handleViewAll : undefined}
      />
      {opensModal ? <NotificationsModal visible={modalOpen} onClose={handleModalClose} /> : null}
    </View>
  );
};

export default HeaderNotifications;
