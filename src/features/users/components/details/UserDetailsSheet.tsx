import { Platform, View, useWindowDimensions } from "react-native";

import BottomSheet from "@/components/ui/BottomSheet";
import type { AdminUser } from "@/features/users/services/userService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { width } = useWindowDimensions();

  const hasActions = Boolean(user) && !error;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      accessibilityLabel="User details"
      surface={palette.cardBg}
      handleColor={palette.divider}
      scrim="rgba(15,23,42,0.35)"
      // The action row below pads itself past the home indicator when present.
      applyBottomInset={!hasActions}
      header={(requestClose) => (
        <View {...dialogAccessibilityProps}>
          <UserSheetHeader titleId={TITLE_ID} onClose={requestClose} />
        </View>
      )}
    >
      <UserSheetBody user={user} loading={loading} error={error} onRetry={onRetry} />

      {hasActions && user ? (
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
    </BottomSheet>
  );
};

export default UserDetailsSheet;
