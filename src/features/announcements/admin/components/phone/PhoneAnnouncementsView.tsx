import { useCallback } from "react";
import { FlatList, RefreshControl, Text, View, type ListRenderItem } from "react-native";

import { CardBottom } from "@/components/dashboard/kit/TableCard";
import UndoToast from "@/components/feedback/UndoToast";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { Announcement } from "../../adminAnnouncement.types";
import { countLine, formatDayTime } from "../../adminAnnouncementModel";
import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import ListState from "../shared/ListState";
import PhoneAnnouncementRow from "./PhoneAnnouncementRow";
import PhoneListHeader from "./PhoneListHeader";

type PhoneAnnouncementsViewProps = {
  screen: AnnouncementsScreenState;
  onExport: () => void;
};

const PhoneAnnouncementsView = ({ screen, onExport }: PhoneAnnouncementsViewProps) => {
  const palette = useAdminSurfacePalette();
  const { view, data, deletion, expandedId, toggleExpanded, openEdit, remove } = screen;


  const renderItem: ListRenderItem<Announcement> = useCallback(
    ({ item, index }) => (
      <PhoneAnnouncementRow
        item={item}
        first={index === 0}
        expanded={item.id === expandedId}
        onToggle={toggleExpanded}
        onEdit={openEdit}
        onDelete={remove}
      />
    ),
    [expandedId, toggleExpanded, openEdit, remove]
  );

  const updated = data.lastUpdatedAt ? ` Last updated ${formatDayTime(data.lastUpdatedAt)}.` : "";

  return (
    <View className="flex-1">
      <FlatList
        data={view === "list" ? screen.visible : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={expandedId}
        ListHeaderComponent={<PhoneListHeader screen={screen} onExport={onExport} />}
        ListFooterComponent={
          <View className="mx-4 mb-6">
            <CardBottom>
              {view === "list" ? (
                <Text className="border-t border-divider px-1 pt-3 text-[12.5px] font-medium text-text2">
                  {`${countLine(screen.visible.length, screen.total)}.${updated}`}
                </Text>
              ) : (
                <ListState view={view} onRetry={data.refetch} onCreate={screen.openCreate} onClearFilters={screen.clearFilters} />
              )}
            </CardBottom>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={data.isRefreshing}
            onRefresh={() => void data.refetch()}
            tintColor={palette.primary}
            colors={[palette.primary]}
          />
        }
        // Room for the toast so it never sits on the last row's buttons.
        contentContainerClassName={deletion.toast ? "pb-20" : ""}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <UndoToast
        message={screen.toastMessage}
        onUndo={deletion.toast?.kind === "pending" ? deletion.undo : undefined}
        undoLabel="Undo delete"
        onDismiss={deletion.dismiss}
        positionClassName="bottom-5 left-3 right-3"
      />
    </View>
  );
};

export default PhoneAnnouncementsView;
