import { useResponsive } from "@/hooks/useResponsive";
import type { AdminUser } from "@/features/users/services/userService";
import UserDetailsPanel from "./UserDetailsPanel";
import UserDetailsSheet from "./details/UserDetailsSheet";

export type UserDetailsProps = {
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

const UserDetails = (props: UserDetailsProps) => {
  const { isMobile } = useResponsive();

  return isMobile ? (
    <UserDetailsSheet {...props} />
  ) : (
    <UserDetailsPanel {...props} />
  );
};

export default UserDetails;
