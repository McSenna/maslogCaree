import React, { useCallback, useId, useMemo, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Modal from "@/components/ui/AppModal";
import { DialogHeader } from "@/components/ui/dialog/DialogHeader";
import { DIALOG_BACKDROP_STYLE, buildDialogSurfaceStyle } from "@/components/ui/dialog/dialogModalStyle";
import { useNotificationsContext } from "@/contexts/NotificationsContext";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { useModalFrame } from "@/hooks/useModalFrame";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { SPACING } from "@/theme/spacing";
import { useReducedMotion } from "@/theme/motion";
import { useNotificationActions } from "../hooks/useNotificationActions";
import type { NotificationFilter } from "../notification.types";
import { formatUnreadStatus } from "../notification.utils";
import MarkAllReadButton from "./MarkAllReadButton";
import NotificationFilterTabs from "./NotificationFilterTabs";
import NotificationListView from "./NotificationListView";

const MAX_WIDTH = 640;
// A fixed height keeps the dialog still while the filter switches between a full list and the empty state.
const MAX_HEIGHT = 720;
const LIST_CONTENT_STYLE = { flexGrow: 1, paddingBottom: SPACING.md } as const;

type NotificationsModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * The full inbox as a centred dialog for desktop web. It scrolls through its own
 * FlatList rather than the shared dialog shell, whose body is a ScrollView, so
 * pagination keeps working.
 */
const NotificationsModal = ({ visible, onClose }: NotificationsModalProps) => {
  const reducedMotion = useReducedMotion();
  useWebModalBehavior(visible, onClose);

  if (!visible) return null;

  return (
    <Modal
      visible
      accessibilityLabel="Notifications"
      transparent
      animationType={reducedMotion ? "none" : "fade"}
      onRequestClose={onClose}
    >
      <NotificationsModalContent onClose={onClose} />
    </Modal>
  );
};

/** Mounted only while open, so the filter starts at All every time. */
const NotificationsModalContent = ({ onClose }: { onClose: () => void }) => {
  const { notifications, unreadCount, loading, loadingMore, hasMore, error, refresh, loadMore, markAllRead } =
    useNotificationsContext();
  const dialogPalette = useResidentDialogPalette();
  const frame = useModalFrame(MAX_WIDTH);
  const attachFocusTrap = useFocusTrap(true);
  const titleId = useId();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  // Close first, then open the announcement, so two dialogs never stack.
  const openAfterClose = useCallback(
    (open: () => void) => {
      onClose();
      open();
    },
    [onClose]
  );
  const { handlePress, isNavigable } = useNotificationActions({ onBeforeNavigate: onClose, openAfterClose });

  const visibleItems = useMemo(
    () => (filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications),
    [filter, notifications]
  );
  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) void loadMore();
  }, [hasMore, loadingMore, loadMore]);

  return (
    <View style={DIALOG_BACKDROP_STYLE}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close notifications"
        onPress={onClose}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      />

      <View
        ref={attachFocusTrap as never}
        accessibilityViewIsModal
        {...Platform.select({ web: { role: "group", "aria-labelledby": titleId } as object })}
        style={[buildDialogSurfaceStyle(dialogPalette, frame), { height: Math.min(frame.maxHeight, MAX_HEIGHT) }]}
      >
        <DialogHeader
          palette={dialogPalette}
          title="Notifications"
          subtitle={formatUnreadStatus(unreadCount)}
          icon="bell"
          titleId={titleId}
          onClose={onClose}
        />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: SPACING.md,
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.sm,
          }}
        >
          <NotificationFilterTabs
            value={filter}
            onChange={setFilter}
            totalCount={notifications.length}
            unreadCount={unreadCount}
          />
          <MarkAllReadButton unreadCount={unreadCount} onPress={() => void markAllRead()} />
        </View>

        <View style={{ flex: 1, minHeight: 0 }}>
          <NotificationListView
            items={visibleItems}
            filter={filter}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            error={error}
            isNavigable={isNavigable}
            onPressItem={handlePress}
            onRetry={() => void refresh()}
            onEndReached={handleEndReached}
            contentContainerStyle={LIST_CONTENT_STYLE}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(NotificationsModal);
