import { useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
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
  const { width } = useWindowDimensions();

  return width < BREAKPOINTS.tablet ? (
    <UserDetailsSheet {...props} />
  ) : (
    <UserDetailsPanel {...props} />
  );
};

export default UserDetails;
