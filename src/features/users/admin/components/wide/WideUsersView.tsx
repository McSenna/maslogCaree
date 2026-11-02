import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { DataTable } from "@/components/data-table";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

import { PAGE_SIZE } from "../../hooks/useUserQueries";
import type { UsersScreenState } from "../../hooks/useUsersScreen";
import MasterListWideList from "../masterList/MasterListWideList";
import { USERS_ERROR, usersEmptyCopy } from "../shared/ScreenStates";
import { userColumns } from "./userColumns";
import WideHeader from "./WideHeader";

type WideUsersViewProps = {
  screen: UsersScreenState;
  width: number;
  insets: RoleScreenInsets;
};

const WideUsersView = ({ screen, width, insets }: WideUsersViewProps) => {
  const { view, filters, details, users, actions, selfId } = screen;
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(filters.page);

  const columns = useMemo(
    () => userColumns({ selfId, savingOverrideId: actions.savingOverrideId, onOpenProfile: details.openDetails, onAction: actions.run }),
    [selfId, actions.savingOverrideId, actions.run, details.openDetails]
  );

  if (screen.masterTab) return <MasterListWideList screen={screen} width={width} insets={insets} />;

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop, paddingBottom: insets.paddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <WideHeader screen={screen} width={width - insets.gutter * 2} />
          <DataTable
            caption="User accounts"
            columns={columns}
            data={users.items}
            rowKey={(row) => row.id}
            loading={view === "loading"}
            refreshing={users.isFetching && view === "list"}
            error={view === "error" ? "Check your connection, then try again." : null}
            errorTitle={USERS_ERROR}
            onRetry={screen.retry}
            {...usersEmptyCopy(filters.tab, view === "noResults", filters.clearFilters)}
            pagination={{ page: filters.page, pageSize: PAGE_SIZE, total: screen.total, onPageChange: filters.setPage, noun: "accounts" }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WideUsersView;
