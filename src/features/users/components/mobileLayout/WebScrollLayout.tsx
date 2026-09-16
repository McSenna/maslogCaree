import type { ReactElement } from "react";
import { ScrollView, View } from "react-native";
import type { RefreshControlProps } from "react-native";

import type { UserManagementController } from "../../hooks/useUserManagementScreen";
import UserRequestMobileCard from "../requests/UserRequestMobileCard";
import UserMobileCard from "../UserMobileCard";

type Props = {
  controller: UserManagementController;
  header: ReactElement;
  empty: ReactElement;
  footer: ReactElement | null;
  refreshControl: ReactElement<RefreshControlProps>;
  contentStyle: object;
};

const WebScrollLayout = ({
  controller,
  header,
  empty,
  footer,
  refreshControl,
  contentStyle,
}: Props) => {
  const { dense, isRequestsSection, requests, filters } = controller;

  const cards = isRequestsSection
    ? requests.requests.map((request) => (
        <UserRequestMobileCard
          key={request._id}
          request={request}
          dense={dense}
          onReview={() => requests.openReview(request._id)}
        />
      ))
    : filters.pageUsers.map((user) => (
        <UserMobileCard
          key={user._id}
          user={user}
          dense={dense}
          onPress={() => controller.openDetails(user._id)}
        />
      ));

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentStyle}
      refreshControl={refreshControl}
    >
      {header}
      {cards.length === 0 ? empty : <View className="w-full gap-2.5">{cards}</View>}
      {footer}
    </ScrollView>
  );
};

export default WebScrollLayout;
