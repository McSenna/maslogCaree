import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import { CardBottom } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import type { User } from "../../userAdmin.types";
import MasterListPhoneList from "../masterList/MasterListPhoneList";
import ListState from "../shared/ScreenStates";
import PhoneListHeader from "./PhoneListHeader";
import PhoneUserRow from "./PhoneUserRow";

type PhoneUsersViewProps = { screen: UsersScreenState; width: number };

const PhoneUsersView = ({ screen, width }: PhoneUsersViewProps) => {
  const palette = useAdminSurfacePalette();
  const { view, filters, users, actions, selfId } = screen;
  const openProfile = screen.details.openDetails;
  const firstUserId = users.items[0]?.id;

  const renderUser: ListRenderItem<User> = useCallback(
    ({ item }) => (
      <PhoneUserRow
        user={item}
        first={item.id === firstUserId}
        selfId={selfId}
        savingOverrideId={actions.savingOverrideId}
        onOpenProfile={openProfile}
        onAction={actions.run}
      />
    ),
    [firstUserId, selfId, openProfile, actions.savingOverrideId, actions.run]
  );

  if (screen.masterTab) return <MasterListPhoneList screen={screen} />;

  const footer = (
    <View className="mx-4">
      <CardBottom>
        {view === "list" ? (
          <View className="items-center gap-2 border-t border-divider pt-3">
            {screen.isLoadingMore ? <ActivityIndicator color={palette.primary} accessibilityLabel="Loading more accounts" /> : null}
            <Text className="font-medium text-text2" style={{ fontSize: 14.5 }}>{`${screen.loadedCount} of ${screen.total} accounts`}</Text>
          </View>
        ) : (
          <ListState view={view} tab={filters.tab} onRetry={screen.retry} onClearFilters={filters.clearFilters} />
        )}
      </CardBottom>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={view === "list" ? users.items : []}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        extraData={actions.savingOverrideId}
        ListHeaderComponent={<PhoneListHeader screen={screen} width={width} />}
        ListFooterComponent={footer}
        onEndReached={screen.loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={users.isRefreshing} onRefresh={screen.refreshAll} tintColor={palette.primary} colors={[palette.primary]} />}
        contentContainerClassName="pb-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PhoneUsersView;
