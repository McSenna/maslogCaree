import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { DataTable } from "@/components/data-table";
import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
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
import OverviewCards from "../shared/OverviewCards";
import UserTabs from "../ui/UserTabs";
import { MASTER_LIST_SUBTITLE, USERS_TITLE } from "../wide/WideHeader";

type Props = { screen: UsersScreenState; width: number; insets: RoleScreenInsets };

// gap-3 between the tabs and the controls.
const TABS_GAP = 12;

const MasterListWideList = ({ screen, width, insets }: Props) => {
  const palette = useAdminSurfacePalette();
  const master = useMasterListScreen({ isPhone: false, onChanged: screen.summary.refetch });
  const { list, openEdit, askToggle } = master;
  // Tab counts change the tab bar's width, so it is measured rather than assumed.
  const [tabsWidth, setTabsWidth] = useState<number | null>(null);
  const filtersBesideTabs =
    tabsWidth !== null && tabsWidth + TABS_GAP + MASTER_TOOLBAR_WIDTH <= width - insets.gutter * 2;
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
            columns={width >= 900 ? 4 : 2}
          />
          {/* Search and filters share the tab row when all fit. Otherwise the search
              stays beside the tabs and the filters take the next line, both at the right edge. */}
          <View className="gap-2">
            <View className="flex-row flex-wrap items-center justify-between gap-3">
              {/* As tall as one control (CONTROL_HEIGHT), so the tabs centre on the search. */}
              <View className="min-h-12 justify-center" onLayout={(event) => setTabsWidth(event.nativeEvent.layout.width)}>
                <UserTabs value={screen.filters.tab} summary={screen.summary.data} onChange={screen.setTab} />
              </View>
              <View className="ml-auto max-w-full flex-row flex-wrap justify-end gap-2">
                <MasterListSearch list={list} />
                {filtersBesideTabs ? <MasterListFilterMenus list={list} /> : null}
              </View>
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
          />
        </View>
      </ScrollView>
      <MasterListOverlays screen={master} />
    </View>
  );
};

export default MasterListWideList;
