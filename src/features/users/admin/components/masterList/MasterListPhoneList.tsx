import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { CardBottom, CardTop } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import MasterListOverlays from "@/features/masterList/components/MasterListOverlays";
import MasterListStates from "@/features/masterList/components/MasterListStates";
import MasterListToolbar from "@/features/masterList/components/MasterListToolbar";
import MasterResidentPhoneRow from "@/features/masterList/components/MasterResidentPhoneRow";
import { useMasterListScreen } from "@/features/masterList/hooks/useMasterListScreen";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import OverviewCards from "../shared/OverviewCards";
import UserTabs from "../ui/UserTabs";
import { MASTER_LIST_SUBTITLE, USERS_TITLE } from "../wide/WideHeader";

type Props = { screen: UsersScreenState; width: number };

/** The Masterlist tab on phones: official records, never accounts. */
const MasterListPhoneList = ({ screen, width }: Props) => {
  const palette = useAdminSurfacePalette();
  const master = useMasterListScreen({ isPhone: true });
  const { list, view, openEdit, askToggle } = master;
  const firstId = list.records[0]?._id;

  const renderRecord: ListRenderItem<MasterResidentRecord> = useCallback(
    ({ item }) => <MasterResidentPhoneRow record={item} first={item._id === firstId} onEdit={openEdit} onToggleActive={askToggle} />,
    [firstId, openEdit, askToggle]
  );

  const header = (
    <View className="gap-3 pb-3 pt-4">
      <View className="gap-3 px-4">
        <DashboardHeader
          palette={palette}
          compact
          title={USERS_TITLE}
          subtitle={MASTER_LIST_SUBTITLE}
          primaryAction={{ key: "add", label: "Add record", icon: "plus", onPress: master.openNew }}
        />
        <OverviewCards compact dense={width < 360} columns={2} summary={screen.summary.data} tab={screen.filters.tab} onSelectTab={screen.setTab} onShowNewest={screen.showNewest} newestSelected={screen.filters.tab === "accounts" && screen.filters.sort === "joined_desc"} />
      </View>
      <UserTabs scroll value={screen.filters.tab} summary={screen.summary.data} onChange={screen.setTab} />
      <View className="px-4">
        <MasterListToolbar list={list} phone />
      </View>
      <View className="mx-4">
        <CardTop />
      </View>
    </View>
  );

  const footer = (
    <View className="mx-4">
      <CardBottom>
        {view === "list" ? (
          <View className="items-center gap-2 border-t border-divider pt-3">
            {list.isFetching && list.page > 1 ? <ActivityIndicator color={palette.primary} accessibilityLabel="Loading more records" /> : null}
            <Text className="text-[12.5px] font-medium text-text2">{`${list.records.length} of ${list.total} records`}</Text>
          </View>
        ) : (
          <MasterListStates view={view} onRetry={list.refresh} onClearFilters={master.clearFilters} onAdd={master.openNew} />
        )}
      </CardBottom>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={view === "list" ? list.records : []}
        keyExtractor={(item) => item._id}
        renderItem={renderRecord}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={<RefreshControl refreshing={list.isRefreshing} onRefresh={list.refresh} tintColor={palette.primary} colors={[palette.primary]} />}
        contentContainerClassName="pb-6"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <MasterListOverlays screen={master} />
    </View>
  );
};

export default MasterListPhoneList;
