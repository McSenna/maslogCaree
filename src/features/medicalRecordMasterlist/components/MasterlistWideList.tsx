import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { DataTable } from "@/components/data-table";
import type { RoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

import { MASTERLIST_PAGE_SIZE } from "../hooks/useMasterlistRecords";
import type { MasterlistScreenState } from "../hooks/useMasterlistScreen";
import { masterlistColumns } from "./masterlistColumns";
import MasterlistHeader from "./MasterlistHeader";
import { MASTERLIST_ERROR, masterlistEmptyCopy } from "./MasterlistStates";

type Props = { screen: MasterlistScreenState; width: number; insets: RoleScreenInsets };

const MasterlistWideList = ({ screen, width, insets }: Props) => {
  const { list, detail } = screen;
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(list.page);
  const openDetail = detail.open;
  const columns = useMemo(() => masterlistColumns(openDetail), [openDetail]);

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop, paddingBottom: insets.paddingBottom }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-4">
        <MasterlistHeader screen={screen} phone={false} width={width} />
        <DataTable
          caption="Medical records"
          columns={columns}
          data={list.records}
          rowKey={(row) => row._id}
          loading={list.isLoading}
          refreshing={list.isFetching && !list.isLoading}
          error={list.error ? "Check your connection, then try again." : null}
          errorTitle={MASTERLIST_ERROR}
          onRetry={list.refresh}
          {...masterlistEmptyCopy(list.filtered, screen.canEncode, screen.clearFilters, screen.openNew)}
          pagination={{ page: list.page, pageSize: MASTERLIST_PAGE_SIZE, total: list.total, onPageChange: list.setPage }}
        />
      </View>
    </ScrollView>
  );
};

export default MasterlistWideList;
