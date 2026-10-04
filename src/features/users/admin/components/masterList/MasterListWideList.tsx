import { useCallback } from "react";
import { FlatList, View, type ListRenderItem } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { CardBottom, CardTop } from "@/components/dashboard/kit/TableCard";
import DesktopPagination from "@/components/ui/pagination/DesktopPagination";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import MasterListHeadings from "@/features/masterList/components/MasterListHeadings";
import MasterListOverlays from "@/features/masterList/components/MasterListOverlays";
import MasterListStates from "@/features/masterList/components/MasterListStates";
import MasterListToolbar from "@/features/masterList/components/MasterListToolbar";
import MasterResidentTableRow from "@/features/masterList/components/MasterResidentTableRow";
import { masterTableModeFor } from "@/features/masterList/components/masterColumns";
import { MASTER_PAGE_SIZE } from "@/features/masterList/hooks/useMasterList";
import { useMasterListScreen } from "@/features/masterList/hooks/useMasterListScreen";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";
import { recordRangeLine } from "@/features/masterList/masterResidentForm";

import { pageCount } from "../../hooks/screenView";
import type { UsersScreenState } from "../../hooks/useUsersScreen";
import OverviewCards from "../shared/OverviewCards";
import UserTabs from "../ui/UserTabs";
import { MASTER_LIST_SUBTITLE, USERS_TITLE } from "../wide/WideHeader";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

type Props = { screen: UsersScreenState; width: number; insets: RoleScreenInsets };

/** The Masterlist tab on wide layouts: official records, never accounts. */
const MasterListWideList = ({ screen, width, insets }: Props) => {
  const palette = useAdminSurfacePalette();
  const master = useMasterListScreen({ isPhone: false });
  const { list, view } = master;
  // A new page starts at its first row.
  const listRef = useScrollTopOnChange<FlatList<MasterResidentRecord>>(list.page);
  const contentWidth = width - insets.gutter * 2;
  const mode = masterTableModeFor(contentWidth);
  const firstId = list.records[0]?._id;
  const { openEdit, askToggle } = master;

  const renderRecord: ListRenderItem<MasterResidentRecord> = useCallback(
    ({ item }) => (
      <MasterResidentTableRow record={item} first={item._id === firstId} mode={mode} onEdit={openEdit} onToggleActive={askToggle} />
    ),
    [firstId, mode, openEdit, askToggle]
  );

  const header = (
    <View className="gap-4">
      <DashboardHeader
        palette={palette}
        compact={false}
        title={USERS_TITLE}
        subtitle={MASTER_LIST_SUBTITLE}
        primaryAction={{ key: "add", label: "Add record", icon: "plus", onPress: master.openNew }}
      />
      <OverviewCards summary={screen.summary.data} tab={screen.filters.tab} onSelectTab={screen.setTab} onShowNewest={screen.showNewest} newestSelected={screen.filters.tab === "accounts" && screen.filters.sort === "joined_desc"} columns={width >= 900 ? 4 : 2} />
      {/* Tabs on the left, search pinned to the right edge; they stack only when the row is too narrow. */}
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <UserTabs value={screen.filters.tab} summary={screen.summary.data} onChange={screen.setTab} />
        {/* ml-auto keeps the search on the right edge even after it wraps under the tabs. */}
        <View className="ml-auto">
          <MasterListToolbar list={list} />
        </View>
      </View>
      <CardTop>{view === "list" || view === "loading" ? <MasterListHeadings mode={mode} /> : null}</CardTop>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        ref={listRef}
        data={view === "list" ? list.records : []}
        keyExtractor={(item) => item._id}
        renderItem={renderRecord}
        extraData={mode}
        ListHeaderComponent={header}
        ListEmptyComponent={
          view === "list" ? null : (
            <CardBottom>
              <MasterListStates view={view} onRetry={list.refresh} onClearFilters={master.clearFilters} onAdd={master.openNew} />
            </CardBottom>
          )
        }
        ListFooterComponent={
          view === "list" ? (
            <CardBottom>
              <View className="border-t border-divider px-1 pt-3">
                <DesktopPagination
                  palette={palette}
                  page={list.page}
                  totalPages={pageCount(list.total, MASTER_PAGE_SIZE)}
                  summary={recordRangeLine(list.page, MASTER_PAGE_SIZE, list.records.length, list.total)}
                  onPageChange={list.setPage}
                />
              </View>
            </CardBottom>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop, paddingBottom: insets.paddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
      <MasterListOverlays screen={master} />
    </View>
  );
};

export default MasterListWideList;
