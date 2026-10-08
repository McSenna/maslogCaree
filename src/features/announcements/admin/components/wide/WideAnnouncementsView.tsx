import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { DataTable } from "@/components/data-table";
import { TABLE_TEXT } from "@/components/data-table/tableTokens";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useThemeColors } from "@/hooks/useThemeColors";

import { countLine, formatDayTime } from "../../adminAnnouncementModel";
import type { AnnouncementsScreenState } from "../../hooks/useAnnouncementsScreen";
import { ANNOUNCEMENTS_ERROR, announcementsEmptyCopy } from "../ui/ScreenStates";
import { AnnouncementDetails, announcementColumns } from "./announcementColumns";
import WideHeader from "./WideHeader";

type WideAnnouncementsViewProps = {
  screen: AnnouncementsScreenState;
  width: number;
  insets: RoleScreenInsets;
  onExport: () => void;
};

const WideAnnouncementsView = ({ screen, width, insets, onExport }: WideAnnouncementsViewProps) => {
  const colors = useThemeColors();
  const { view, data, deletion, expandedId, toggleExpanded, openEdit, remove, visible } = screen;
  const columns = useMemo(
    () => announcementColumns({ expandedId, onToggle: toggleExpanded, onEdit: openEdit, onDelete: remove }),
    [expandedId, toggleExpanded, openEdit, remove]
  );

  // The undo bar for a pending delete sits over the bottom of the page, so the list leaves room for it.
  const padding = {
    paddingHorizontal: insets.gutter,
    paddingTop: insets.paddingTop,
    paddingBottom: insets.paddingBottom + (deletion.pending ? 72 : 0),
  };

  const footer = (
    <View className="flex-row flex-wrap justify-between gap-x-6 gap-y-1">
      <Text style={[TABLE_TEXT.cell, { color: colors.muted }]}>{countLine(visible.length, screen.total)}</Text>
      {data.lastUpdatedAt ? (
        <Text style={[TABLE_TEXT.cell, { color: colors.muted }]}>{`Last updated ${formatDayTime(data.lastUpdatedAt)}`}</Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={padding} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View className="gap-4">
        <WideHeader screen={screen} width={width - insets.gutter * 2} onExport={onExport} />
        <DataTable
          caption="Announcements"
          columns={columns}
          data={visible}
          rowKey={(item) => item.id}
          loading={view === "loading"}
          error={view === "error" ? "Check your connection, then try again." : null}
          errorTitle={ANNOUNCEMENTS_ERROR}
          onRetry={data.refetch}
          {...announcementsEmptyCopy(view === "noResults", screen.openCreate, screen.clearFilters)}
          isRowSelected={(item) => item.id === expandedId}
          renderExpanded={(item) => (item.id === expandedId ? <AnnouncementDetails item={item} /> : null)}
          footer={footer}
        />
      </View>
    </ScrollView>
  );
};

export default WideAnnouncementsView;
