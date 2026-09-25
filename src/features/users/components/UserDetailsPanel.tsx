import { View, useWindowDimensions } from "react-native";

import DetailsModalShell from "@/components/ui/dialog/DetailsModalShell";
import type { AdminUser } from "@/features/users/services/userService";

import UserModalActions from "./details/UserModalActions";
import { useUserDetailsPalette } from "./details/detailsTheme";
import { UserModalBody } from "./panel/UserModalBody";
import { TITLE_ID, UserModalHeader } from "./panel/UserModalHeader";

const MAX_WIDTH = 1000;

const TWO_COLUMN_WIDTH = 900;

type UserDetailsPanelProps = {
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

const UserDetailsPanel = ({
  visible,
  user,
  onClose,
  onChangeStatus,
  onViewActivity,
  busy = false,
  loading = false,
  error = null,
  onRetry,
}: UserDetailsPanelProps) => {
  const palette = useUserDetailsPalette();
  const { width } = useWindowDimensions();
  const compact = width < TWO_COLUMN_WIDTH;

  return (
    <DetailsModalShell
      visible={visible}
      onClose={onClose}
      closeLabel="Close user details"
      labelledBy={TITLE_ID}
      maxWidth={MAX_WIDTH}
    >
      <View className="px-7 pb-5 pt-7">
        <UserModalHeader onClose={onClose} />
      </View>

      <UserModalBody user={user} loading={loading} error={error} onRetry={onRetry} compact={compact} />

      {user && !error ? (
        <View
          className="px-7 pb-7 pt-5"
          style={{ borderTopWidth: 1, borderTopColor: palette.divider }}
        >
          <UserModalActions
            user={user}
            busy={busy}
            compact={compact}
            onChangeStatus={() => onChangeStatus(user)}
            onViewActivity={() => onViewActivity(user)}
          />
        </View>
      ) : null}
    </DetailsModalShell>
  );
};

export default UserDetailsPanel;
