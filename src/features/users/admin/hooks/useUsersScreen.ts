import { useCallback, useEffect, useMemo, useState } from "react";

import { toast } from "@/components/feedback";
import { useAuth } from "@/contexts/AuthContext";

import { useUserDetailsState } from "../../hooks/userManagement/useUserDetailsState";
import { useRequestReview } from "../../hooks/requests/useRequestReview";
import { deactivateUsers, reactivateUsers } from "../services/userAdminApi";
import type { MenuAnchor, StatusAction, User, UserTab } from "../userAdmin.types";
import { applyStatusChanges } from "../userStatusOverlay";
import { resolveView } from "./screenView";
import { useRowSelection } from "./useRowSelection";
import { useStatusUndo, type StatusBatch } from "./useStatusUndo";
import { useUserFilterState } from "./useUserFilterState";
import { PAGE_SIZE, useSignupRequests, useUserSummary, useUsers } from "./useUserQueries";
import { invalidateUsers } from "./usersVersion";

export type ReviewTarget = { id: string; reject: boolean } | null;
/** The open row menu and the dots button it opened from. */
export type RowMenu = { userId: string; anchor: MenuAnchor };

const isRequestTab = (tab: UserTab) => tab === "requests" || tab === "rejected";

/** Everything the wide and phone layouts share; only the presentation differs. */
export const useUsersScreen = ({ isPhone }: { isPhone: boolean }) => {
  // The count from the visible list's last load lets the filters move a page past the end back onto the last page.
  const [listTotal, setListTotal] = useState<number | null>(null);
  const filters = useUserFilterState({ appendPages: isPhone, total: listTotal });
  const { tab, query, role, status, sort, page, setPage } = filters;
  const requestTab = isRequestTab(tab);
  // The Masterlist tab shows official records from its own feature; no account list loads behind it.
  const masterTab = tab === "masterlist";

  const summary = useUserSummary();
  const users = useUsers({ tab, query, role, status, sort, page, pageSize: PAGE_SIZE, append: isPhone, enabled: !requestTab && !masterTab });
  const requests = useSignupRequests({
    status: tab === "rejected" ? "rejected" : "pending",
    query,
    page,
    pageSize: PAGE_SIZE,
    enabled: requestTab,
    append: isPhone,
  });

  // Infinite scroll restarts from the first page, so a refetch never appends stale rows.
  const invalidate = useCallback(() => {
    if (isPhone) setPage(1);
    invalidateUsers();
  }, [isPhone, setPage]);

  const commit = useCallback(
    async (batch: StatusBatch) => {
      const updated = await (batch.action === "deactivate" ? deactivateUsers : reactivateUsers)(batch.ids);
      invalidate();
      // The server skips accounts it will not change; the toast must not claim they were.
      if (updated.length < batch.ids.length) throw new Error("Some accounts were not updated");
    },
    [invalidate]
  );
  const undo = useStatusUndo(commit, users.items);

  const rows = useMemo(() => applyStatusChanges(users.items, undo.batches, tab), [users.items, undo.batches, tab]);
  const rowIds = useMemo(() => rows.map((user) => user.id), [rows]);
  const selection = useRowSelection(rowIds);
  const [menu, setMenu] = useState<RowMenu | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget>(null);

  const usersError = users.error ? "Could not load users." : null;
  const details = useUserDetailsState(users.records, users.isLoading, usersError);
  const review = useRequestReview({ refresh: async () => invalidate() });

  const setTab = (next: UserTab) => {
    if (next === tab) return;
    selection.clear();
    setMenu(null);
    filters.setTab(next);
  };

  // The server refuses to change the signed-in admin's own account, so it is never offered.
  const selfId = useAuth().user?.id ?? null;
  const changeStatus = (candidates: readonly User[], action: StatusAction) => {
    const targets = candidates.filter((user) => user.id !== selfId);
    if (targets.length === 0) {
      toast.info("You cannot change your own account status", "Ask another admin to do it.");
      return;
    }
    setMenu(null);
    selection.clear();
    undo.request({ ids: targets.map((user) => user.id), names: targets.map((user) => user.fullName), action });
  };

  // "Added this month": every account, newest first.
  const showNewest = () => {
    setTab("accounts");
    filters.setSort("joined_desc");
  };

  const openReview = (id: string, reject: boolean) => {
    setReviewTarget({ id, reject });
    void review.openReview(id);
  };

  const closeReview = () => {
    setReviewTarget(null);
    review.closeReview();
  };

  const list = requestTab ? requests : users;
  const listSettled = !masterTab && !list.isFetching;
  const listCount = list.total;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirrors the server's count once a load settles
    setListTotal(listSettled ? listCount : null);
  }, [listSettled, listCount]);
  // A page past the end (a stale link, or the last page's rows deleted) reads as loading, never as an empty list.
  const pastEnd = !isPhone && listSettled && list.total > 0 && page > Math.ceil(list.total / PAGE_SIZE);

  const view = resolveView({
    isLoading: list.isLoading || pastEnd,
    error: list.error,
    shown: requestTab ? requests.items.length : rows.length,
    filtered: filters.hasFilters,
  });

  const loadedCount = requestTab ? requests.items.length : users.items.length;
  // Phone infinite scroll: the next page, once the current one has landed.
  const loadMore = () => {
    if (!list.isFetching && view === "list" && loadedCount < list.total) setPage(page + 1);
  };

  // Pull to refresh: the visible list (with its spinner) and the counts.
  const refreshAll = () => {
    if (isPhone) setPage(1);
    list.refetch();
    summary.refetch();
  };

  return {
    filters,
    setTab,
    showNewest,
    requestTab,
    masterTab,
    summary,
    users,
    rows,
    requests,
    view,
    selection,
    selectedUsers: rows.filter((user) => selection.isSelected(user.id)),
    selfId,
    menu,
    menuUser: menu ? rows.find((user) => user.id === menu.userId) ?? null : null,
    openMenu: setMenu,
    closeMenu: () => setMenu(null),
    undo,
    changeStatus,
    details,
    review,
    reviewTarget,
    openReview,
    closeReview,
    total: requestTab ? requests.total : Math.max(0, users.total - (users.items.length - rows.length)),
    refreshAll,
    loadMore,
    loadedCount,
    isLoadingMore: list.isFetching && page > 1,
    retry: list.refetch,
  };
};

export type UsersScreenState = ReturnType<typeof useUsersScreen>;
