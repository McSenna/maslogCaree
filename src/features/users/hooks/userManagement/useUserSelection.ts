import { useCallback, useState } from "react";
import type { AdminUser } from "../../services/userService";

export const useUserSelection = (pageUsers: AdminUser[]) => {
  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());

  const toggleUser = useCallback((userId: string, next: boolean) => {
    setCheckedIds((previous) => {
      const draft = new Set(previous);
      if (next) draft.add(userId);
      else draft.delete(userId);
      return draft;
    });
  }, []);

  const toggleAllOnPage = useCallback(
    (next: boolean) => {
      setCheckedIds((previous) => {
        const draft = new Set(previous);
        pageUsers.forEach((user) => (next ? draft.add(user._id) : draft.delete(user._id)));
        return draft;
      });
    },
    [pageUsers]
  );

  return { checkedIds, toggleUser, toggleAllOnPage };
};
