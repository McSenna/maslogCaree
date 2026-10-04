import { useCallback } from "react";
import { FlatList, View, type ListRenderItem } from "react-native";

import { CardBottom, CardTop } from "@/components/dashboard/kit/TableCard";
import DesktopPagination from "@/components/ui/pagination/DesktopPagination";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

import { MASTERLIST_PAGE_SIZE } from "../hooks/useMasterlistRecords";
import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import type { MasterlistRow } from "../types";
import { rangeLine } from "./masterlistCopy";
import { masterlistTableModeFor } from "./masterlistColumns";
import MasterlistHeader from "./MasterlistHeader";
import MasterlistHeadings from "./MasterlistHeadings";
import MasterlistStates from "./MasterlistStates";
import MasterlistTableRow from "./MasterlistTableRow";

type Props = { screen: MasterlistScreenState; width: number; insets: RoleScreenInsets };

const MasterlistWideList = ({ screen, width, insets }: Props) => {
  const palette = useAdminSurfacePalette();
  const { list, view, detail } = screen;
  // A new page starts at its first row.
  const listRef = useScrollTopOnChange<FlatList<MasterlistRow>>(list.page);
  const mode = masterlistTableModeFor(width - insets.gutter * 2);
  const firstId = list.records[0]?._id;
  const openDetail = detail.open;

  const renderRow: ListRenderItem<MasterlistRow> = useCallback(
    ({ item }) => <MasterlistTableRow row={item} first={item._id === firstId} mode={mode} onView={openDetail} />,
    [firstId, mode, openDetail]
  );

  const header = (
    <View className="gap-4">
      <MasterlistHeader screen={screen} phone={false} width={width} />
      <CardTop>{view === "list" || view === "loading" ? <MasterlistHeadings mode={mode} /> : null}</CardTop>
    </View>
  );

  const footer =
    view === "list" ? (
      <CardBottom>
        <View className="border-t border-divider px-1 pt-3">
          <DesktopPagination
            palette={palette}
            page={list.page}
            totalPages={Math.max(1, Math.ceil(list.total / MASTERLIST_PAGE_SIZE))}
            summary={rangeLine(list.page, MASTERLIST_PAGE_SIZE, list.records.length, list.total)}
            onPageChange={list.setPage}
          />
        </View>
      </CardBottom>
    ) : null;

  return (
    <FlatList
      ref={listRef}
      data={view === "list" ? list.records : []}
      keyExtractor={(item) => item._id}
      renderItem={renderRow}
      extraData={mode}
      ListHeaderComponent={header}
      ListEmptyComponent={
        view === "list" ? null : (
          <CardBottom>
            <MasterlistStates view={view} canEncode={screen.canEncode} onRetry={list.refresh} onClearFilters={screen.clearFilters} onAdd={screen.openNew} />
          </CardBottom>
        )
      }
      ListFooterComponent={footer}
      contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop, paddingBottom: insets.paddingBottom }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default MasterlistWideList;
