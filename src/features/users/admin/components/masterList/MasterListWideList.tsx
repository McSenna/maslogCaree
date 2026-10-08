import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { DataTable } from "@/components/data-table";
import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";
import masterListColumns from "@/features/masterList/components/masterListColumns";
import MasterListOverlays from "@/features/masterList/components/MasterListOverlays";
import { MASTER_LIST_ERROR, masterListEmptyCopy } from "@/features/masterList/components/MasterListStates";
import MasterListToolbar from "@/features/masterList/components/MasterListToolbar";
import { MASTER_PAGE_SIZE } from "@/features/masterList/hooks/useMasterList";
import { useMasterListScreen } from "@/features/masterList/hooks/useMasterListScreen";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import OverviewCards from "../shared/OverviewCards";
import UserTabs from "../ui/UserTabs";
import { MASTER_LIST_SUBTITLE, USERS_TITLE } from "../wide/WideHeader";

type Props = { screen: UsersScreenState; width: number; insets: RoleScreenInsets };

const MasterListWideList = ({ screen, width, insets }: Props) => {
  const palette = useAdminSurfacePalette();
  const master = useMasterListScreen({ isPhone: false });
  const { list, openEdit, askToggle } = master;
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(list.page);
  const columns = useMemo(
    () => masterListColumns({ onEdit: openEdit, onToggleActive: askToggle }),
    [openEdit, askToggle]
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
          <DashboardHeader
            palette={palette}
            compact={false}
            title={USERS_TITLE}
            subtitle={MASTER_LIST_SUBTITLE}
            primaryAction={{ key: "add", label: "Add record", icon: "plus", onPress: master.openNew }}
          />
          <OverviewCards
            summary={screen.summary.data}
            tab={screen.filters.tab}
            onSelectTab={screen.setTab}
            onShowNewest={screen.showNewest}
            newestSelected={screen.filters.tab === "accounts" && screen.filters.sort === "joined_desc"}
            columns={width >= 900 ? 4 : 2}
          />
          <View className="flex-row flex-wrap items-center justify-between gap-3">
            <UserTabs value={screen.filters.tab} summary={screen.summary.data} onChange={screen.setTab} />
            <View className="ml-auto">
              <MasterListToolbar list={list} />
            </View>
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
          />
        </View>
      </ScrollView>
      <MasterListOverlays screen={master} />
    </View>
  );
};

export default MasterListWideList;
