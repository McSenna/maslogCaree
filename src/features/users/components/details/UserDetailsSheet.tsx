import {
  Animated,
  Modal,
  Platform,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSheetDragDismiss } from "@/hooks/useSheetDragDismiss";
import { useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import type { AdminUser } from "@/features/users/services/userService";
import UserModalActions from "./UserModalActions";
import { useUserDetailsPalette } from "./detailsTheme";
import UserSheetBody from "./sheet/UserSheetBody";
import UserSheetHeader from "./sheet/UserSheetHeader";

const TITLE_ID = "user-details-sheet-title";

const dialogAccessibilityProps =
  Platform.OS === "web" ? ({ "aria-labelledby": TITLE_ID } as object) : {};

const NARROW_WIDTH = 480;

type UserDetailsSheetProps = {
  visible: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onChangeStatus: (user: AdminUser) => void;
  onViewActivity: (user: AdminUser) => void;
  busy?: boolean;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const UserDetailsSheet = ({
  visible,
  user,
  onClose,
  onChangeStatus,
  onViewActivity,
  busy = false,
  loading = false,
  error = null,
  onRetry,
}: UserDetailsSheetProps) => {
  const palette = useUserDetailsPalette();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();

  useWebModalBehavior(visible, onClose);

  const { dragY, panResponder } = useSheetDragDismiss(visible, onClose);

  if (!visible) return null;


  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      {...dialogAccessibilityProps}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(15,23,42,0.35)" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close user details"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
        />

        <Animated.View
          className="w-full overflow-hidden"
          style={{
            maxHeight: height * 0.92,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: palette.cardBg,
            transform: [{ translateY: dragY }],
            shadowColor: "#0F2557",
            shadowOpacity: 0.2,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -6 },
            elevation: 16,
          }}
        >
          <View {...panResponder.panHandlers}>
            <UserSheetHeader titleId={TITLE_ID} onClose={onClose} />
          </View>

          <UserSheetBody user={user} loading={loading} error={error} onRetry={onRetry} />

          {user && !error ? (
            <View
              className="w-full px-4 pt-3"
              style={{
                borderTopWidth: 1,
                borderTopColor: palette.divider,
                paddingBottom: Math.max(insets.bottom, 12) + 4,
              }}
            >
              <UserModalActions
                user={user}
                busy={busy}
                compact={width < NARROW_WIDTH}
                destructiveLast
                onChangeStatus={() => onChangeStatus(user)}
                onViewActivity={() => onViewActivity(user)}
              />
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UserDetailsSheet;
