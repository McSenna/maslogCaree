import { useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import { CardBottom, CardTop } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import type { MasterlistRow } from "../types";
import MasterlistHeader from "./MasterlistHeader";
import MasterlistPhoneRow from "./MasterlistPhoneRow";
import MasterlistStates from "./MasterlistStates";

type Props = { screen: MasterlistScreenState; width: number };

const MasterlistPhoneList = ({ screen, width }: Props) => {
  const palette = useAdminSurfacePalette();
  const { list, view, detail } = screen;
  const firstId = list.records[0]?._id;
  const openDetail = detail.open;

  const renderRow: ListRenderItem<MasterlistRow> = useCallback(
    ({ item }) => <MasterlistPhoneRow row={item} first={item._id === firstId} onView={openDetail} />,
    [firstId, openDetail]
  );

  const header = (
    <View className="gap-3 pb-3 pt-4">
      <View className="px-4">
        <MasterlistHeader screen={screen} phone={width < 600} width={width} />
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
          <MasterlistStates view={view} canEncode={screen.canEncode} onRetry={list.refresh} onClearFilters={screen.clearFilters} onAdd={screen.openNew} />
        )}
      </CardBottom>
    </View>
  );

  return (
    <FlatList
      data={view === "list" ? list.records : []}
      keyExtractor={(item) => item._id}
      renderItem={renderRow}
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
  );
};

export default MasterlistPhoneList;
