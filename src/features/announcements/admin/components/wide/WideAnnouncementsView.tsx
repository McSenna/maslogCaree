import { useCallback } from "react";
import { FlatList, Text, View, type ListRenderItem } from "react-native";

import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import type { Announcement } from "../../adminAnnouncement.types";
import { countLine, formatDayTime } from "../../adminAnnouncementModel";
import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import ListState from "../shared/ListState";
import UndoToast from "../ui/UndoToast";
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
  const lastId = visible[visible.length - 1]?.id;

  const renderItem: ListRenderItem<Announcement> = useCallback(
    ({ item }) => (
      <WideAnnouncementRow
        item={item}
        mode={mode}
        last={item.id === lastId}
        expanded={item.id === expandedId}
        onToggle={toggleExpanded}
        onEdit={openEdit}
        onDelete={remove}
      />
    ),
    [mode, lastId, expandedId, toggleExpanded, openEdit, remove]
  );

  // Page padding comes from the role shell's insets, which change with the window.
  const padding = {
    paddingHorizontal: insets.gutter,
    paddingTop: insets.paddingTop,
    paddingBottom: insets.paddingBottom + (deletion.toastKind ? 72 : 0),
  };
  const toastFrame = { marginHorizontal: insets.gutter };

  return (
    <View className="flex-1">
      <FlatList
        data={view === "list" ? visible : []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={`${expandedId}:${mode}`}
        ListHeaderComponent={<WideHeader screen={screen} mode={mode} onExport={onExport} />}
        ListEmptyComponent={
          view === "list" ? null : (
            <View className="rounded-b-panel border-x border-b border-line bg-canvas">
              <ListState view={view} onRetry={data.refetch} onCreate={screen.openCreate} onClearFilters={screen.clearFilters} />
            </View>
          )
        }
        ListFooterComponent={
          view === "list" ? (
            <View className="mt-3 flex-row flex-wrap justify-between gap-x-6 gap-y-1">
              <Text className="font-ps text-13 text-text2">{countLine(visible.length, screen.total)}</Text>
              {data.lastUpdatedAt ? (
                <Text className="font-ps text-13 text-text2">{`Last updated ${formatDayTime(data.lastUpdatedAt)}`}</Text>
              ) : null}
            </View>
          ) : null
        }
        contentContainerStyle={padding}
        showsVerticalScrollIndicator={false}
      />
      <View pointerEvents="box-none" className="absolute inset-0" style={toastFrame}>
        <UndoToast wide kind={deletion.toastKind} onUndo={deletion.undo} onDismiss={deletion.dismiss} />
      </View>
    </View>
  );
};

export default WideAnnouncementsView;
