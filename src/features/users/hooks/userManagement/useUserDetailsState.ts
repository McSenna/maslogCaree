import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import type { AdminUser } from "../../services/userService";

export const useUserDetailsState = (users: AdminUser[], loading: boolean, error: string | null) => {
  const router = useRouter();
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);

  const detailsUser = useMemo(
    () => users.find((user) => user._id === detailsUserId) ?? null,
    [users, detailsUserId]
  );

  const detailsError =
    detailsUserId !== null && !detailsUser && !loading
      ? error ?? "This account is no longer in the user list."
      : null;

  const viewActivity = useCallback(
    (user: AdminUser) => {
      setDetailsUserId(null);
      router.push({ pathname: "/admin/system-logs", params: { search: user.email } });
    },
    [router]
  );

  return {
    detailsUserId,
    openDetails: setDetailsUserId,
    closeDetails: () => setDetailsUserId(null),
    detailsUser,
    detailsError,
    viewActivity,
  };
};
