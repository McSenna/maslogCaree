import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import { CardBottom, CardTop } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import MasterListOverlays from "@/features/masterList/components/MasterListOverlays";
import MasterListStates from "@/features/masterList/components/MasterListStates";
import MasterListToolbar from "@/features/masterList/components/MasterListToolbar";
import MasterResidentPhoneRow from "@/features/masterList/components/MasterResidentPhoneRow";
import { useMasterListScreen } from "@/features/masterList/hooks/useMasterListScreen";
import type { MasterResidentRecord } from "@/features/masterList/masterList.types";

import type { UsersScreenState } from "../../hooks/useUsersScreen";
import UsersPageHeader from "../shared/UsersPageHeader";

type Props = { screen: UsersScreenState };

/** The Masterlist tab on phones: official records, never accounts. */
const MasterListPhoneList = ({ screen }: Props) => {
  const palette = useAdminSurfacePalette();
  const master = useMasterListScreen({ isPhone: true, onChanged: screen.summary.refetch });
  const { list, view, openEdit, askToggle, askDelete, removing, toggling, deleting } = master;
  const firstId = list.records[0]?._id;

  const renderRecord: ListRenderItem<MasterResidentRecord> = useCallback(
    ({ item }) => <MasterResidentPhoneRow record={item} first={item._id === firstId} onEdit={openEdit} onToggleActive={askToggle} onDelete={askDelete} busy={removing || toggling} deletingId={removing ? deleting?._id : undefined} />,
    [firstId, openEdit, askToggle, askDelete, removing, toggling, deleting]
  );

  const header = (
    <View className="gap-3 pb-3 pt-4">
      <View className="px-4">
        <UsersPageHeader screen={screen} compact onAddRecord={master.openNew} />
      </View>
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
            <Text className="text-[14.5px] font-medium text-text2">{`${list.records.length} of ${list.total} records`}</Text>
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
        refreshControl={<RefreshControl refreshing={list.isRefreshing} onRefresh={() => { list.refresh(); screen.summary.refetch(); }} tintColor={palette.primary} colors={[palette.primary]} />}
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
