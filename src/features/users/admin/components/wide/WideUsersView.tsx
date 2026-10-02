import { useCallback } from "react";
import { FlatList, View, type ListRenderItem } from "react-native";

import UndoToast from "@/components/feedback/UndoToast";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import { PAGE_SIZE } from "../../hooks/useUserQueries";
import type { UsersScreenState } from "../../hooks/useUsersScreen";
import type { MenuAnchor, SignupRequest, User } from "../../userAdmin.types";
import ListState from "../shared/ScreenStates";
import RequestTableRow from "./RequestTableRow";
import { CardBottom } from "@/components/dashboard/kit/TableCard";
import TableFooter from "./TableFooter";
import { tableModeFor } from "./tableColumns";
import UserTableRow from "./UserTableRow";
import WideHeader from "./WideHeader";

type WideUsersViewProps = {
  screen: UsersScreenState;
  width: number;
  insets: RoleScreenInsets;
  onExport: () => void;
  onAddUser: () => void;
};

const WideUsersView = ({ screen, width, insets, onExport, onAddUser }: WideUsersViewProps) => {
  const { view, filters, selection, menu, requestTab, undo } = screen;
  const contentWidth = width - insets.gutter * 2;
  const mode = tableModeFor(contentWidth);
  const { toggle, isSelected } = selection;
  const { openReview, openMenu, details } = screen;
  const openProfile = details.openDetails;
  const firstUserId = screen.rows[0]?.id;
  const firstRequestId = screen.requests.items[0]?.id;

  const onOpenMenu = useCallback((userId: string, anchor: MenuAnchor | null) => openMenu({ userId, anchor }), [openMenu]);

  const renderUser: ListRenderItem<User> = useCallback(
    ({ item }) => (
      <UserTableRow
        user={item}
        mode={mode}
        first={item.id === firstUserId}
        selected={isSelected(item.id)}
        menuOpen={menu?.userId === item.id}
        onToggle={toggle}
        onOpenProfile={openProfile}
        onOpenMenu={onOpenMenu}
      />
    ),
    [mode, firstUserId, isSelected, menu, toggle, openProfile, onOpenMenu]
  );

  const renderRequest: ListRenderItem<SignupRequest> = useCallback(
    ({ item }) => <RequestTableRow request={item} mode={mode} first={item.id === firstRequestId} onReview={openReview} />,
    [mode, firstRequestId, openReview]
  );

  const shown = requestTab ? screen.requests.items.length : screen.rows.length;
  const padding = {
    paddingHorizontal: insets.gutter,
    paddingTop: insets.paddingTop,
    paddingBottom: insets.paddingBottom + (undo.toast ? 72 : 0),
  };
  const shared = {
    ListHeaderComponent: <WideHeader screen={screen} mode={mode} width={contentWidth} onExport={onExport} onAddUser={onAddUser} />,
    ListEmptyComponent:
      view === "list" ? null : (
        <CardBottom>
          <ListState view={view} tab={filters.tab} onRetry={screen.retry} onClearFilters={filters.clearFilters} />
        </CardBottom>
      ),
    ListFooterComponent:
      view === "list" ? <TableFooter page={filters.page} pageSize={PAGE_SIZE} shown={shown} total={screen.total} onPage={filters.setPage} /> : null,
    contentContainerStyle: padding,
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: "handled" as const,
  };

  return (
    <View className="flex-1">
      {requestTab ? (
        <FlatList data={view === "list" ? screen.requests.items : []} keyExtractor={(item) => item.id} renderItem={renderRequest} extraData={mode} {...shared} />
      ) : (
        <FlatList
          data={view === "list" ? screen.rows : []}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          extraData={`${mode}:${selection.count}:${menu?.userId}`}
          {...shared}
        />
      )}
      <View pointerEvents="box-none" className="absolute inset-0">
        <UndoToast
          message={undo.message}
          onUndo={undo.toast?.kind === "pending" ? undo.undo : undefined}
          onDismiss={undo.dismiss}
          positionClassName="bottom-8 left-10 w-[420px] max-w-full"
        />
      </View>
    </View>
  );
};

export default WideUsersView;
