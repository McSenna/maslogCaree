import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { handOffActivitySearch } from "@/features/systemLogs/activitySearchHandoff";

import { useRemoteData } from "../../admin/hooks/useRemoteData";
import { fetchUserDetail } from "../../admin/services/userAdminApi";
import type { AdminUser } from "../../services/userService";

const USER_SOURCES = ["user"] as const;

/** The View drawer: fetched when it opens, and kept fresh while it is open. */
export const useUserDetailsState = () => {
  const router = useRouter();
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);

  const remote = useRemoteData<AdminUser | null>({
    key: detailsUserId ?? "closed",
    load: () => (detailsUserId ? fetchUserDetail(detailsUserId) : Promise.resolve(null)),
    live: detailsUserId ? USER_SOURCES : undefined,
  });

  // The previous person's data is never shown while the next one loads.
  const detailsUser = remote.data && remote.data._id === detailsUserId ? remote.data : null;

  const viewActivity = useCallback(
    (user: AdminUser) => {
      setDetailsUserId(null);
      handOffActivitySearch(user.email);
      router.push("/admin/system-logs");
    },
    [router]
  );

  return {
    detailsUserId,
    openDetails: setDetailsUserId,
    closeDetails: () => setDetailsUserId(null),
    detailsUser,
    detailsLoading: detailsUserId !== null && !detailsUser && !remote.error,
    detailsError: detailsUserId !== null && remote.error ? "Could not load this account." : null,
    retryDetails: remote.refetch,
    viewActivity,
  };
};
