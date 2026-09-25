import { useMemo, useState } from "react";
import { notifyToast } from "@/components/feedback/toast/toastStore";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { computeUserMetrics } from "../components/userMetrics";
import { DENSE_WINDOW_WIDTH, USERS_LAYOUT } from "../constants/usersLayout";
import { useUserDetailsState } from "./userManagement/useUserDetailsState";
import { useUserSections } from "./userManagement/useUserSections";
import { useUserSelection } from "./userManagement/useUserSelection";
import { useUserFilters } from "./useUserFilters";
import { useUserRequests } from "./useUserRequests";
import { useUsers } from "./useUsers";
import { useUserStatusChange } from "./useUserStatusChange";

export const useUserManagementScreen = () => {
  const insets = useRoleScreenInsets();
  const showToast = notifyToast;

  const [contentWidth, setContentWidth] = useState(insets.width);
  const [tableAreaWidth, setTableAreaWidth] = useState(0);

  const { users, loading, error, refreshing, fetchUsers, refreshUsers, applyUserUpdate } =
    useUsers();

  const requests = useUserRequests(showToast);
  const { section, sectionUsers, sectionCounts, setSection: setSectionRaw } = useUserSections(
    users,
    requests
  );

  const filters = useUserFilters(sectionUsers);
  const metrics = useMemo(() => computeUserMetrics(users), [users]);

  const details = useUserDetailsState(users, loading, error);
  const setSection = (next: typeof section) => setSectionRaw(next, details.closeDetails);

  const statusChange = useUserStatusChange({
    applyUserUpdate,
    onResult: showToast,
  });

  const selection = useUserSelection(filters.pageUsers);

  const addUser = () => {
    showToast(
      "Creating a user from here isn't available yet — accounts are added through registration."
    );
  };

  const measureContent = (event: { nativeEvent: { layout: { width: number } } }) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== contentWidth) setContentWidth(next);
  };

  return {
    insets,
    showToast,
    section,
    setSection,
    sectionCounts,
    requests,
    isRequestsSection: section === "requests" || section === "rejected",
    users,
    loading,
    error,
    refreshing,
    fetchUsers,
    refreshUsers,
    filters,
    metrics,
    statusChange,
    ...details,
    ...selection,
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
};

export type UserManagementController = ReturnType<typeof useUserManagementScreen>;
