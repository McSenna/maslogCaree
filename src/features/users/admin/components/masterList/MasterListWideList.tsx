import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { DataTable } from "@/components/data-table";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";
import masterListColumns from "@/features/masterList/components/masterListColumns";
import MasterListOverlays from "@/features/masterList/components/MasterListOverlays";
import { MASTER_LIST_ERROR, masterListEmptyCopy } from "@/features/masterList/components/MasterListStates";
import {
  MASTER_TOOLBAR_WIDTH,
  MasterListClearButton,
  MasterListFilterMenus,
  MasterListSearch,
} from "@/features/masterList/components/MasterListToolbar";
import { MASTER_PAGE_SIZE } from "@/features/masterList/hooks/useMasterList";
import { useMasterListScreen } from "@/features/masterList/hooks/useMasterListScreen";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import UsersPageHeader from "../shared/UsersPageHeader";

type Props = { screen: UsersScreenState; width: number; insets: RoleScreenInsets };

const MasterListWideList = ({ screen, width, insets }: Props) => {
  const master = useMasterListScreen({ isPhone: false, onChanged: screen.summary.refetch });
  const { list, openView, openEdit, askDelete, removing, deleting } = master;
  const filtersBesideTabs = MASTER_TOOLBAR_WIDTH <= width - insets.gutter * 2;
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(list.page);
  const columns = useMemo(
    () => masterListColumns({ onView: openView, onEdit: openEdit, onDelete: askDelete, busy: removing, deletingId: removing ? deleting?._id : undefined }),
    [openView, openEdit, askDelete, removing, deleting]
  );

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingHorizontal: insets.gutter,
          paddingTop: insets.paddingTop,
          paddingBottom: insets.paddingBottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          <UsersPageHeader screen={screen} onAddRecord={master.openNew} />
          {/* Search and filters share a row when all fit; otherwise the filters take the next line. */}
          <View className="gap-2">
            <View className="flex-row flex-wrap items-center justify-end gap-2">
              <MasterListSearch list={list} />
              {filtersBesideTabs ? <MasterListFilterMenus list={list} /> : null}
            </View>
            {filtersBesideTabs ? null : <MasterListFilterMenus list={list} />}
            <MasterListClearButton list={list} />
          </View>
          <DataTable
            caption="Resident records"
            columns={columns}
            data={list.records}
            rowKey={(record) => record._id}
            loading={list.isLoading}
            refreshing={list.isFetching && !list.isLoading}
            error={list.error ? "Check your connection, then try again." : null}
            errorTitle={MASTER_LIST_ERROR}
            onRetry={list.refresh}
            {...masterListEmptyCopy(list.filtered, master.clearFilters, master.openNew)}
            pagination={{ page: list.page, pageSize: MASTER_PAGE_SIZE, total: list.total, onPageChange: list.setPage }}
          onRowPress={openView}
          rowPressMode="pointer"
          />
        </View>
      </ScrollView>
      <MasterListOverlays screen={master} />
    </View>
  );
};

export default MasterListWideList;
