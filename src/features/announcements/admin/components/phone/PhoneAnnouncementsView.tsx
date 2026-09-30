import { useCallback } from "react";
import { FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import type { Announcement } from "../../adminAnnouncement.types";
import { countLine, formatDayTime } from "../../adminAnnouncementModel";
import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import { useAnnouncementTheme } from "../../useAnnouncementTheme";
import ListState from "../shared/ListState";
import UndoToast from "../ui/UndoToast";
import PhoneAnnouncementRow from "./PhoneAnnouncementRow";
import PhoneListHeader from "./PhoneListHeader";

type PhoneAnnouncementsViewProps = {
  screen: AnnouncementsScreenState;
  onExport: () => void;
};

const PhoneAnnouncementsView = ({ screen, onExport }: PhoneAnnouncementsViewProps) => {
  const { palette } = useAnnouncementTheme();
  const { view, data, deletion, expandedId, toggleExpanded, openEdit, remove } = screen;

  const lastIndex = screen.visible.length - 1;

  const renderItem: ListRenderItem<Announcement> = useCallback(
    ({ item, index }) => (
      <PhoneAnnouncementRow
        item={item}
        first={index === 0}
        last={index === lastIndex}
        expanded={item.id === expandedId}
        onToggle={toggleExpanded}
        onEdit={openEdit}
        onDelete={remove}
      />
    ),
    [expandedId, lastIndex, toggleExpanded, openEdit, remove]
  );

  const updated = data.lastUpdatedAt ? ` Last updated ${formatDayTime(data.lastUpdatedAt)}.` : "";

  return (
    <View className="flex-1">
      <FlatList
        data={view === "list" ? screen.visible : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={`${expandedId}:${lastIndex}`}
        ListHeaderComponent={<PhoneListHeader screen={screen} onExport={onExport} />}
        ListEmptyComponent={
          view === "list" ? null : (
            <View className="mx-4 overflow-hidden rounded-panel border border-line bg-canvas">
              <ListState view={view} onRetry={data.refetch} onCreate={screen.openCreate} onClearFilters={screen.clearFilters} />
            </View>
          )
        }
        ListFooterComponent={
          view === "list" ? (
            <Text className="px-4 pb-7 pt-4 font-ps text-13 text-text2">
              {`${countLine(screen.visible.length, screen.total)}.${updated}`}
            </Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={data.isRefreshing}
            onRefresh={() => void data.refetch()}
            tintColor={palette.brand}
            colors={[palette.brand]}
          />
        }
        // Room for the toast so it never sits on the last row's buttons.
        contentContainerClassName={deletion.toastKind ? "pb-20" : ""}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <UndoToast kind={deletion.toastKind} onUndo={deletion.undo} onDismiss={deletion.dismiss} />
    </View>
  );
};

export default PhoneAnnouncementsView;
