import { useCallback, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useToast } from "@/components/ui/Toast";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { computeUserMetrics } from "../components/userMetrics";
import { DENSE_WINDOW_WIDTH, USERS_LAYOUT } from "../constants/usersLayout";
import type { AdminUser } from "../services/userService";
import { useUserFilters } from "./useUserFilters";
import { useUsers } from "./useUsers";
import { useUserStatusChange } from "./useUserStatusChange";

/**
 * The User Management screen's whole data and layout layer.
 *
 * The account list arrives in one request and everything else — metrics,
 * filtering, paging — is derived from it here, so the table, the cards and the
 * details panel are always describing the same array.
 */
export function useUserManagementScreen() {
  const router = useRouter();
  const insets = useRoleScreenInsets();
  const { toast, showToast, hideToast } = useToast();

  // Measured content width. Seeded from the window so the first paint is not a
  // phone layout on a desktop; replaced by the real figure on layout.
  const [contentWidth, setContentWidth] = useState(insets.width);
  // The table's own box, measured separately: the card sits inside the page
  // gutter and its border, so deriving it from contentWidth would leave the
  // table a couple of pixels wide and scrolling when it should sit flush.
  const [tableAreaWidth, setTableAreaWidth] = useState(0);
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());

  const { users, loading, error, refreshing, fetchUsers, refreshUsers, applyUserUpdate } =
    useUsers();

  const filters = useUserFilters(users);
  const metrics = useMemo(() => computeUserMetrics(users), [users]);

  const statusChange = useUserStatusChange({
    applyUserUpdate,
    onResult: showToast,
  });

  // Derived from the list rather than held as its own copy, so the dialog shows
  // the updated record immediately after a status change.
  const detailsUser = useMemo(
    () => users.find((user) => user._id === detailsUserId) ?? null,
    [users, detailsUserId]
  );

  // The dialog reads the record the table already holds, so there is no second
  // request to fail — the only way it can come up empty is the list failing to
  // load, or the account disappearing from a refresh while the dialog is open.
  const detailsError =
    detailsUserId !== null && !detailsUser && !loading
      ? error ?? "This account is no longer in the user list."
      : null;

  const viewActivity = useCallback(
    (user: AdminUser) => {
      // System Logs is the activity trail this app already keeps; sending the
      // admin there pre-filtered beats a second log viewer that would drift
      // from it. Email rather than name — it is the unique field the log search
      // matches on.
      setDetailsUserId(null);
      router.push({ pathname: "/admin/system-logs", params: { search: user.email } });
    },
    [router]
  );

  const toggleUser = useCallback((userId: string, next: boolean) => {
    setCheckedIds((previous) => {
      const draft = new Set(previous);
      if (next) draft.add(userId);
      else draft.delete(userId);
      return draft;
    });
  }, []);

  const { pageUsers } = filters;
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

  const addUser = useCallback(() => {
    // No admin-side create endpoint exists yet; accounts are created through
    // the public registration + OTP flow. Say so rather than opening a form
    // that has nothing to submit to.
    showToast(
      "Creating a user from here isn't available yet — accounts are added through registration."
    );
  }, [showToast]);

  const measureContent = (event: { nativeEvent: { layout: { width: number } } }) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== contentWidth) setContentWidth(next);
  };

  return {
    insets,
    toast,
    hideToast,
    users,
    loading,
    error,
    refreshing,
    fetchUsers,
    refreshUsers,
    filters,
    metrics,
    statusChange,
    detailsUserId,
    openDetails: setDetailsUserId,
    closeDetails: () => setDetailsUserId(null),
    detailsUser,
    detailsError,
    viewActivity,
    checkedIds,
    toggleUser,
    toggleAllOnPage,
    addUser,
    tableAreaWidth,
    setTableAreaWidth,
    measureContent,
    showTable: contentWidth >= USERS_LAYOUT.table,
    fourMetrics: contentWidth >= USERS_LAYOUT.fourMetrics,
    dense: insets.width < DENSE_WINDOW_WIDTH,
    contentPadding: {
      paddingHorizontal: insets.gutter,
      paddingTop: insets.paddingTop,
      paddingBottom: insets.paddingBottom,
    },
  };
}

export type UserManagementController = ReturnType<typeof useUserManagementScreen>;
