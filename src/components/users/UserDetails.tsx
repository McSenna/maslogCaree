import { useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import type { AdminUser } from "@/services/userService";
import UserDetailsPanel from "./UserDetailsPanel";
import UserDetailsSheet from "./details/UserDetailsSheet";

export type UserDetailsProps = {
  visible: boolean;
  /** Null while the record is loading, or when it could not be read at all. */
  user: AdminUser | null;
  onClose: () => void;
  onChangeStatus: (user: AdminUser) => void;
  onViewActivity: (user: AdminUser) => void;
  /** True while this user's status change is in flight. */
  busy?: boolean;
  loading?: boolean;
  /** Why the record is missing, when it is not simply still loading. */
  error?: string | null;
  onRetry?: () => void;
};

/**
 * User details, in whichever form the screen can carry.
 *
 * One entry point over two presentations: a centred dialog with two content
 * columns where there is room for it, and a bottom sheet on a phone, where a
 * centred dialog would be a small box floating in the middle of the display
 * with its controls out of thumb reach.
 *
 * Both are fed the same selected user from User Management's own list, so
 * neither fetches anything and the two can never disagree about what they are
 * showing. The breakpoint is the app's tablet line, the same one the shell uses
 * to swap the sidebar for the bottom nav, so the dialog and the chrome around
 * it change over together.
 */
export default function UserDetails(props: UserDetailsProps) {
  const { width } = useWindowDimensions();

  return width < BREAKPOINTS.tablet ? (
    <UserDetailsSheet {...props} />
  ) : (
    <UserDetailsPanel {...props} />
  );
}
