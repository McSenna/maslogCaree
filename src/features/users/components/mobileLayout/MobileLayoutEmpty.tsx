import type { ReactNode } from "react";
import { View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";

import type { UserManagementController } from "../../hooks/useUserManagementScreen";
import UserRequestsEmptyState from "../requests/UserRequestsEmptyState";
import UserRequestsSkeleton from "../requests/UserRequestsSkeleton";
import UsersSkeletonList from "../UsersSkeletonList";
import { useUsersPalette } from "../usersTheme";

type Props = { controller: UserManagementController; emptyState: ReactNode };

const MobileLayoutEmpty = ({ controller, emptyState }: Props) => {
  const palette = useUsersPalette();
  const { dense, isRequestsSection, requests, loading } = controller;

  const requestsHaveFilters =
    requests.search.trim().length > 0 || requests.idType !== "" || requests.datePreset !== "all";
  const listLoading = isRequestsSection ? requests.loading : loading;

  if (listLoading) {
    return isRequestsSection ? (
      <UserRequestsSkeleton count={5} isMobile dense={dense} />
    ) : (
      <UsersSkeletonList count={6} isMobile dense={dense} />
    );
  }

  return (
    <View
      className="w-full border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      {isRequestsSection ? (
        <UserRequestsEmptyState
          error={requests.error}
          hasActiveFilters={requestsHaveFilters}
          status={requests.status}
          onRetry={requests.fetchRequests}
        />
      ) : (
        emptyState
      )}
    </View>
  );
};

export default MobileLayoutEmpty;
