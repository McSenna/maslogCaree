import type { ReactNode } from "react";
import { View } from "react-native";

import type { UserManagementController } from "../../hooks/useUserManagementScreen";
import UserRequestsFilters from "../requests/UserRequestsFilters";
import UserMetricCards from "../UserMetricCards";
import UserSectionTabs from "../UserSectionTabs";

type Props = {
  controller: UserManagementController;
  toolbar: ReactNode;
};

const MobileLayoutHeader = ({ controller, toolbar }: Props) => {
  const { isRequestsSection, requests } = controller;

  return (
    <View className="w-full gap-4 pb-3">
      <UserMetricCards metrics={controller.metrics} isWide={false} />
      <UserSectionTabs
        section={controller.section}
        onSectionChange={controller.setSection}
        counts={controller.sectionCounts}
        isDesktop={false}
      />
      {isRequestsSection ? (
        <UserRequestsFilters
          search={requests.search}
          onSearchChange={requests.setSearch}
          status={requests.status}
          onStatusChange={requests.setStatus}
          showStatusFilter={controller.section === "requests"}
          idType={requests.idType}
          onIdTypeChange={requests.setIdType}
          datePreset={requests.datePreset}
          onDatePresetChange={requests.setDatePreset}
          isDesktop={false}
          resultCount={requests.total}
        />
      ) : (
        toolbar
      )}
    </View>
  );
};

export default MobileLayoutHeader;
