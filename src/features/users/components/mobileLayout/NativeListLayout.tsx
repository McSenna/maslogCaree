import type { ReactElement } from "react";
import { FlatList, View } from "react-native";
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

const NativeListLayout = ({
  controller,
  header,
  empty,
  footer,
  refreshControl,
  contentStyle,
}: Props) => {
  const { dense, isRequestsSection, requests, loading, error, filters } = controller;

  if (isRequestsSection) {
    return (
      <FlatList
        className="flex-1"
        data={requests.loading || requests.error ? [] : requests.requests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={contentStyle}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        renderItem={({ item }) => (
          <UserRequestMobileCard
            request={item}
            dense={dense}
            onReview={() => requests.openReview(item._id)}
          />
        )}
      />
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={loading || error ? [] : filters.pageUsers}
      keyExtractor={(item) => item._id}
      contentContainerStyle={contentStyle}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={footer}
      ItemSeparatorComponent={() => <View className="h-2.5" />}
      renderItem={({ item }) => (
        <UserMobileCard
          user={item}
          dense={dense}
          onPress={() => controller.openDetails(item._id)}
        />
      )}
    />
  );
};

export default NativeListLayout;
