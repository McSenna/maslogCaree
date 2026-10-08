import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { DataTable } from "@/components/data-table";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

import { PAGE_SIZE } from "../../hooks/useUserQueries";
import type { UsersScreenState } from "../../hooks/useUsersScreen";
import MasterListWideList from "../masterList/MasterListWideList";
import { USERS_ERROR, usersEmptyCopy } from "../shared/ScreenStates";
import { requestColumns, userColumns } from "./userColumns";
import WideHeader from "./WideHeader";

type WideUsersViewProps = {
  screen: UsersScreenState;
  width: number;
  insets: RoleScreenInsets;
  onExport: () => void;
};

const CONNECTION_HINT = "Check your connection, then try again.";

const WideUsersView = ({ screen, width, insets, onExport }: WideUsersViewProps) => {
  const { view, filters, selection, menu, requestTab } = screen;
  const { openReview, openMenu, details } = screen;
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(filters.page);
  const pending = filters.tab === "requests";
  const menuUserId = menu?.userId ?? null;

  const users = useMemo(
    () =>
      userColumns({
        selection,
        menuUserId,
        onOpenProfile: details.openDetails,
        onOpenMenu: (userId, anchor) => openMenu({ userId, anchor }),
      }),
    [selection, menuUserId, details.openDetails, openMenu]
  );
  const requests = useMemo(() => requestColumns({ pending, onReview: openReview }), [pending, openReview]);

  if (screen.masterTab) return <MasterListWideList screen={screen} width={width} insets={insets} />;

  const contentWidth = width - insets.gutter * 2;
  const list = requestTab ? screen.requests : screen.users;
  const shared = {
    loading: view === "loading",
    refreshing: list.isFetching && view === "list",
    error: view === "error" ? CONNECTION_HINT : null,
    errorTitle: USERS_ERROR,
    onRetry: screen.retry,
    ...usersEmptyCopy(filters.tab, view === "noResults", filters.clearFilters),
    pagination: {
      page: filters.page,
      pageSize: PAGE_SIZE,
      total: screen.total,
      onPageChange: filters.setPage,
      noun: requestTab ? "requests" : "users",
    },
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop, paddingBottom: insets.paddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <WideHeader screen={screen} width={contentWidth} onExport={onExport} />
          {requestTab ? (
            <DataTable caption="Sign-up requests" columns={requests} data={screen.requests.items} rowKey={(row) => row.id} {...shared} />
          ) : (
            <DataTable
              caption="Users"
              columns={users}
              data={screen.rows}
              rowKey={(row) => row.id}
              isRowSelected={(row) => selection.isSelected(row.id)}
              {...shared}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WideUsersView;
