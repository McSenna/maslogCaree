import { View } from "react-native";

import Pagination from "@/components/ui/Pagination";

import type { UserManagementController } from "../../hooks/useUserManagementScreen";
import { PAGE_SIZE } from "../../constants/usersLayout";
import { REQUESTS_PAGE_SIZE } from "../requests/userRequestsColumns";

type Props = { controller: UserManagementController };

const MobileLayoutFooter = ({ controller }: Props) => {
  const { filters, loading, error, isRequestsSection, requests } = controller;

  const listCount = isRequestsSection ? requests.total : filters.filteredUsers.length;
  const listLoading = isRequestsSection ? requests.loading : loading;
  const listError = isRequestsSection ? requests.error : error;

  if (listLoading || listError || listCount === 0) return null;

  return (
    <View className="w-full pt-4">
      <Pagination
        page={isRequestsSection ? requests.page : filters.page}
        totalPages={isRequestsSection ? requests.totalPages : filters.totalPages}
        total={listCount}
        pageSize={isRequestsSection ? REQUESTS_PAGE_SIZE : PAGE_SIZE}
        isDesktop={false}
        onPageChange={isRequestsSection ? requests.setPage : filters.setPage}
        noun={isRequestsSection ? "requests" : undefined}
      />
    </View>
  );
};

export default MobileLayoutFooter;
