import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import UndoToast from "@/components/feedback/UndoToast";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import type { MenuAnchor, SignupRequest, User } from "../../userAdmin.types";
import ListState from "../shared/ScreenStates";
import { CardBottom } from "@/components/dashboard/kit/TableCard";
import PhoneListHeader from "./PhoneListHeader";
import PhoneRequestRow from "./PhoneRequestRow";
import PhoneUserRow from "./PhoneUserRow";
import MasterListPhoneList from "../masterList/MasterListPhoneList";
import SelectionBar from "./SelectionBar";

type PhoneUsersViewProps = { screen: UsersScreenState; width: number; onExport: () => void };

const PhoneUsersView = ({ screen, width, onExport }: PhoneUsersViewProps) => {
  const palette = useAdminSurfacePalette();
  const { view, filters, selection, menu, requestTab, undo, openMenu, openReview } = screen;
  const selecting = selection.count > 0;
  const reactivate = filters.tab === "deactivated";
  const { toggle, isSelected } = selection;
  const openProfile = screen.details.openDetails;
  const firstUserId = screen.rows[0]?.id;
  const firstRequestId = screen.requests.items[0]?.id;

  const onOpenMenu = useCallback((userId: string, anchor: MenuAnchor) => openMenu({ userId, anchor }), [openMenu]);
  const renderUser: ListRenderItem<User> = useCallback(
    ({ item }) => (
      <PhoneUserRow
        user={item}
        first={item.id === firstUserId}
        selecting={selecting}
        selected={isSelected(item.id)}
        menuOpen={menu?.userId === item.id}
        onToggle={toggle}
        onOpenProfile={openProfile}
        onOpenMenu={onOpenMenu}
      />
    ),
    [firstUserId, selecting, isSelected, menu, toggle, openProfile, onOpenMenu]
  );
  const renderRequest: ListRenderItem<SignupRequest> = useCallback(
    ({ item }) => <PhoneRequestRow request={item} first={item.id === firstRequestId} onReview={openReview} />,
    [firstRequestId, openReview]
  );

  if (screen.masterTab) return <MasterListPhoneList screen={screen} width={width} />;

  const footer = (
    <View className="mx-4">
      <CardBottom>
        {view === "list" ? (
          <View className="items-center gap-2 border-t border-divider pt-3">
            {screen.isLoadingMore ? <ActivityIndicator color={palette.primary} accessibilityLabel="Loading more users" /> : null}
            <Text className="text-[12.5px] font-medium text-text2">{`${screen.loadedCount} of ${screen.total} ${requestTab ? "requests" : "users"}`}</Text>
          </View>
        ) : (
          <ListState phone view={view} tab={filters.tab} onRetry={screen.retry} onClearFilters={filters.clearFilters} />
        )}
      </CardBottom>
    </View>
  );

  const shared = {
    ListHeaderComponent: <PhoneListHeader screen={screen} width={width} onExport={onExport} />,
    ListFooterComponent: footer,
    onEndReached: screen.loadMore,
    onEndReachedThreshold: 0.4,
    refreshControl: (
      <RefreshControl refreshing={screen.users.isRefreshing || screen.requests.isRefreshing} onRefresh={screen.refreshAll} tintColor={palette.primary} colors={[palette.primary]} />
    ),
    // Room for the toast so it never sits on the last row's buttons.
    contentContainerClassName: undo.toast ? "pb-24" : "pb-6",
    keyboardShouldPersistTaps: "handled" as const,
    keyboardDismissMode: "on-drag" as const,
    showsVerticalScrollIndicator: false,
  };

  return (
    <View className="flex-1">
      <SelectionBar
        selectedCount={selection.count}
        reactivate={reactivate}
        onClearSelection={selection.clear}
        onStatus={() => screen.changeStatus(screen.selectedUsers, reactivate ? "reactivate" : "deactivate")}
      />
      {requestTab ? (
        <FlatList data={view === "list" ? screen.requests.items : []} keyExtractor={(item) => item.id} renderItem={renderRequest} {...shared} />
      ) : (
        <FlatList
          data={view === "list" ? screen.rows : []}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          extraData={`${selection.count}:${menu?.userId}`}
          {...shared}
        />
      )}
      <UndoToast
        message={undo.message}
        onUndo={undo.toast?.kind === "pending" ? undo.undo : undefined}
        onDismiss={undo.dismiss}
        positionClassName="bottom-5 left-3 right-3"
      />
    </View>
  );
};

export default PhoneUsersView;
