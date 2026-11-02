import { useCallback, useEffect, useState } from "react";

import { toast } from "@/components/feedback";
import { useAuth } from "@/contexts/AuthContext";

import { useRequestReview } from "../../hooks/requests/useRequestReview";
import { useUserDetailsState } from "../../hooks/userManagement/useUserDetailsState";
import type { AdminUser } from "../../services/userService";
import { statusActionFor } from "../../services/userService";
import type { UserTab } from "../userAdmin.types";
import { pageAfterChange } from "../userAdminModel";
import { useRowActions } from "./useRowActions";
import { resolveView } from "./screenView";
import { useUserExport } from "./useUserExport";
import { useUserFilterState } from "./useUserFilterState";
import { PAGE_SIZE, useUserSummary, useUsers } from "./useUserQueries";
import { invalidateUsers } from "./usersVersion";

export type ReviewTarget = { id: string; reject: boolean } | null;

/** Everything the wide and phone layouts share; only the presentation differs. */
export const useUsersScreen = ({ isPhone }: { isPhone: boolean }) => {
  // The count from the visible list's last load lets the filters move a page past the end back onto the last page.
  const [listTotal, setListTotal] = useState<number | null>(null);
  const filters = useUserFilterState({ appendPages: isPhone, total: listTotal });
  const { tab, query, role, status, sort, page, setPage } = filters;
  // The Masterlist tab shows official records from its own feature; no account list loads behind it.
  const masterTab = tab === "masterlist";

  const summary = useUserSummary();
  const users = useUsers({ tab, query, role, status, sort, page, pageSize: PAGE_SIZE, append: isPhone, enabled: !masterTab });
  const exporter = useUserExport({ tab, query, role, status, sort });

  // Infinite scroll restarts from the first page, so a refetch never appends stale rows.
  const invalidate = useCallback(() => {
    if (isPhone) setPage(1);
    invalidateUsers();
  }, [isPhone, setPage]);

  const details = useUserDetailsState();
  const review = useRequestReview({ refresh: async () => invalidate() });
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);

  const openReview = useCallback(
    (id: string, reject: boolean) => {
      setReviewTarget({ id, reject });
      void review.openReview(id);
    },
    [review.openReview] // eslint-disable-line react-hooks/exhaustive-deps -- the hook's callback is the stable part
  );
  const closeReview = () => {
    setReviewTarget(null);
    review.closeReview();
  };

  const actions = useRowActions({ openReview, refresh: invalidate });

  const selfId = useAuth().user?.id ?? null;

  // The drawer's status button: the same dialog as the row's icon.
  const changeStatusFromDrawer = (record: AdminUser) => {
    const action = statusActionFor(record);
    if (!action) return;
    if (record._id === selfId) {
      toast.info("You cannot change your own account status", "Ask another admin to do it.");
      return;
    }
    details.closeDetails();
    actions.run({ id: record._id, fullName: record.fullname, verificationId: null, portalAccess: record.portalAccess ?? null }, action.action);
  };

  const setTab = (next: UserTab) => {
    if (next !== tab) filters.setTab(next);
  };

  const listSettled = !masterTab && !users.isFetching;
  const listCount = users.total;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    setListTotal(listSettled ? listCount : null);
  }, [listSettled, listCount]);
  // A page past the end (a stale link, or the last row on the last page leaving) reads as loading, never as an empty list.
  const pastEnd = !isPhone && listSettled && users.total > 0 && pageAfterChange(page, users.total, PAGE_SIZE) !== page;

  const view = resolveView({
    isLoading: users.isLoading || pastEnd,
    error: users.error,
    shown: users.items.length,
    filtered: filters.hasFilters,
  });

  const loadedCount = users.items.length;
  // Phone infinite scroll: the next page, once the current one has landed.
  const loadMore = () => {
    if (!users.isFetching && view === "list" && loadedCount < users.total) setPage(page + 1);
  };

  // Pull to refresh: the visible list (with its spinner) and the counts.
  const refreshAll = () => {
    if (isPhone) setPage(1);
    users.refetch();
    summary.refetch();
  };

  return {
    filters,
    setTab,
    masterTab,
    summary,
    users,
    view,
    selfId,
    details,
    changeStatusFromDrawer,
    review,
    reviewTarget,
    openReview,
    closeReview,
    actions,
    exporting: exporter.exporting,
    exportList: () => void exporter.exportList(),
    total: users.total,
    refreshAll,
    loadMore,
    loadedCount,
    isLoadingMore: users.isFetching && page > 1,
    retry: users.refetch,
  };
};

export type UsersScreenState = ReturnType<typeof useUsersScreen>;
