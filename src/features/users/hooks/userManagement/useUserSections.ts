import { useCallback, useMemo, useState } from "react";
import type { UserSection } from "../../components/UserSectionTabs";
import { DISABLED_STATUSES, type AdminUser } from "../../services/userService";
import type { useUserRequests } from "../useUserRequests";

const AWAITING_DECISION: readonly AdminUser["status"][] = ["pending", "rejected"];

export const useUserSections = (users: AdminUser[], requests: ReturnType<typeof useUserRequests>) => {
  const [section, setSectionState] = useState<UserSection>("active");

  const sectionUsers = useMemo(() => {
    if (section === "deactivated") {
      return users.filter((user) => DISABLED_STATUSES.includes(user.status));
    }
    return users.filter(
      (user) => !DISABLED_STATUSES.includes(user.status) && !AWAITING_DECISION.includes(user.status)
    );
  }, [users, section]);

  const sectionCounts = useMemo(
    () => ({
      active: users.filter(
        (user) => !DISABLED_STATUSES.includes(user.status) && !AWAITING_DECISION.includes(user.status)
      ).length,
      requests: requests.counts.pending,
      rejected: requests.counts.rejected,
      deactivated: users.filter((user) => DISABLED_STATUSES.includes(user.status)).length,
    }),
    [users, requests.counts.pending, requests.counts.rejected]
  );

  const setSection = useCallback(
    (next: UserSection, onBeforeChange: () => void) => {
      setSectionState(next);
      onBeforeChange();
      requests.closeReview();
      if (next === "rejected") requests.setStatus("rejected");
      else if (next === "requests") requests.setStatus("pending");
    },
    [requests]
  );

  return { section, sectionUsers, sectionCounts, setSection };
};
