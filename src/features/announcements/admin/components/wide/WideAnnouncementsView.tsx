import { useCallback } from "react";
import { FlatList, Text, View, type ListRenderItem } from "react-native";

import { CardBottom } from "@/components/dashboard/kit/TableCard";
import UndoToast from "@/components/feedback/UndoToast";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import type { Announcement } from "../../adminAnnouncement.types";
import { countLine, formatDayTime } from "../../adminAnnouncementModel";
import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import ListState from "../shared/ListState";
import { tableModeFor } from "./tableColumns";
import WideAnnouncementRow from "./WideAnnouncementRow";
import WideHeader from "./WideHeader";

type WideAnnouncementsViewProps = {
  screen: AnnouncementsScreenState;
  width: number;
  insets: RoleScreenInsets;
  onExport: () => void;
};

const WideAnnouncementsView = ({ screen, width, insets, onExport }: WideAnnouncementsViewProps) => {
  const { view, data, deletion, expandedId, toggleExpanded, openEdit, remove, visible } = screen;
  const mode = tableModeFor(width - insets.gutter * 2);
  const firstId = visible[0]?.id;

  const renderItem: ListRenderItem<Announcement> = useCallback(
    ({ item }) => (
      <WideAnnouncementRow
        item={item}
        mode={mode}
        first={item.id === firstId}
        expanded={item.id === expandedId}
        onToggle={toggleExpanded}
        onEdit={openEdit}
        onDelete={remove}
      />
    ),
    [mode, firstId, expandedId, toggleExpanded, openEdit, remove]
  );

  // Page padding comes from the role shell's insets, which change with the window.
  const padding = {
    paddingHorizontal: insets.gutter,
    paddingTop: insets.paddingTop,
    paddingBottom: insets.paddingBottom + (deletion.toast ? 72 : 0),
  };
  const toastFrame = { marginHorizontal: insets.gutter };

  return (
    <View className="flex-1">
      <FlatList
        data={view === "list" ? visible : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={`${expandedId}:${mode}`}
        ListHeaderComponent={<WideHeader screen={screen} mode={mode} width={width - insets.gutter * 2} onExport={onExport} />}
        ListEmptyComponent={
          view === "list" ? null : (
            <CardBottom>
              <ListState view={view} onRetry={data.refetch} onCreate={screen.openCreate} onClearFilters={screen.clearFilters} />
            </CardBottom>
          )
        }
        ListFooterComponent={
          view === "list" ? (
            <CardBottom>
              <View className="flex-row flex-wrap justify-between gap-x-6 gap-y-1 border-t border-divider px-1 pt-3">
                <Text className="text-[12.5px] font-medium text-text2">{countLine(visible.length, screen.total)}</Text>
                {data.lastUpdatedAt ? (
                  <Text className="text-[12.5px] font-medium text-text2">{`Last updated ${formatDayTime(data.lastUpdatedAt)}`}</Text>
                ) : null}
              </View>
            </CardBottom>
          ) : null
        }
        contentContainerStyle={padding}
        showsVerticalScrollIndicator={false}
      />
      <View pointerEvents="box-none" className="absolute inset-0" style={toastFrame}>
        <UndoToast
          message={screen.toastMessage}
          onUndo={deletion.toast?.kind === "pending" ? deletion.undo : undefined}
          undoLabel="Undo delete"
          onDismiss={deletion.dismiss}
          positionClassName="bottom-8 left-0 w-[420px] max-w-full"
        />
      </View>
    </View>
  );
};

export default WideAnnouncementsView;
