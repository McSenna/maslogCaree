import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useUsersPalette } from "@/features/users/components/usersTheme";
import type { BhwResidentsController } from "../hooks/useBhwResidentsScreen";
import ResidentSummaryCards from "./ResidentSummaryCards";
import { DataTable } from "@/components/data-table";
import { RESIDENTS_ERROR, residentsEmptyCopy } from "./ResidentsEmptyState";
import { residentColumns } from "./residentColumns";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

type ResidentsDesktopLayoutProps = {
  controller: BhwResidentsController;
  toolbar: ReactNode;
};

const ResidentsDesktopLayout = ({ controller, toolbar }: ResidentsDesktopLayoutProps) => {
  const palette = useUsersPalette();
  const { residents } = controller;
  const empty = residentsEmptyCopy(residents.hasActiveFilters);
  // A new page starts at its first row.
  const scrollRef = useScrollTopOnChange<ScrollView>(controller.residents.page);

  return (
    <ScrollView
      ref={scrollRef}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={controller.contentPadding}
      refreshControl={
        <RefreshControl
          refreshing={controller.residents.refreshing}
          onRefresh={controller.residents.refresh}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View className="w-full gap-5">
        <ResidentSummaryCards
          summary={controller.residents.summary}
          activeStatus={controller.residents.status}
          onSelectStatus={controller.residents.showStatus}
          isWide={controller.wideSummary}
        />
        <DataTable
          caption="Residents"
          columns={residentColumns}
          data={residents.residents}
          rowKey={(resident) => resident._id}
          toolbar={toolbar}
          loading={residents.loading}
          refreshing={residents.busy && !residents.loading}
          error={residents.error}
          errorTitle={RESIDENTS_ERROR}
          onRetry={residents.retry}
          emptyIcon="users"
          emptyTitle={empty.title}
          emptyDescription={empty.body}
          onRowPress={(resident) => controller.openDetails(resident._id)}
          rowLabel={(resident) => `View details for ${resident.fullname}`}
          isRowSelected={(resident) => resident._id === controller.detailsResidentId}
          pagination={{
            page: residents.page,
            pageSize: residents.pageSize,
            total: residents.total,
            onPageChange: residents.setPage,
            noun: "residents",
          }}
        />
      </View>
    </ScrollView>
  );
};

export default ResidentsDesktopLayout;
