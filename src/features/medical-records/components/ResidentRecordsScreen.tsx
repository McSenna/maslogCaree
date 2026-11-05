import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import DashboardHeader from "@/components/dashboard/kit/DashboardHeader";
import { DataTable } from "@/components/data-table";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useUsersTheme } from "@/features/users/admin/useUsersTheme";
import { RESIDENT_RECORDS_PAGE_SIZE, useResidentMedicalRecords } from "@/hooks/useResidentMedicalRecords";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";
import { useScrollTopOnChange } from "@/hooks/useScrollTopOnChange";

import { residentRecordColumns } from "./residentRecordColumns";
import { ResidentMedicalDetailsDialog } from "./ResidentMedicalDetailsDialog";
import ResidentRecordsToolbar from "./ResidentRecordsToolbar";

/** The resident's own records, in the layout staff use for theirs: one table, read only. */
const ResidentRecordsScreen = () => {
  const theme = useUsersTheme();
  const palette = useAdminSurfacePalette();
  const insets = useRoleScreenInsets();
  const { isMobile } = useResponsive();
  const list = useResidentMedicalRecords();
  const scrollRef = useScrollTopOnChange<ScrollView>(list.page);
  const { open, detail } = list;
  const columns = useMemo(() => residentRecordColumns(open), [open]);

  return (
    <View style={theme.vars} className="w-full flex-1">
      <RoleScreenBackdrop color={theme.palette.page} insets={insets} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: insets.gutter, paddingTop: insets.paddingTop, paddingBottom: insets.paddingBottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className={isMobile ? "gap-3" : "gap-4"}>
          <DashboardHeader hideHeading palette={palette} compact={isMobile} title="Medical records" subtitle="" />
          <ResidentRecordsToolbar list={list} phone={isMobile} />
          <DataTable
            caption="My medical records"
            columns={columns}
            data={list.rows}
            rowKey={(row) => row._id}
            loading={list.isLoading}
            refreshing={list.isRefreshing}
            error={list.error ? "Check your connection, then try again." : null}
            errorTitle="Unable to load your medical records."
            onRetry={list.refresh}
            emptyIcon={list.filtered ? "search" : "file-text"}
            emptyTitle={list.filtered ? "No medical records found" : "No medical records yet"}
            emptyDescription={
              list.filtered
                ? "Nothing matches this search and these filters."
                : "Your visits and the health center's records for you appear here once they are filed."
            }
            emptyAction={list.filtered ? { label: "Clear filters", icon: "x", onPress: list.clearFilters, variant: "outlined" } : undefined}
            pagination={{ page: list.page, pageSize: RESIDENT_RECORDS_PAGE_SIZE, total: list.total, onPageChange: list.setPage, noun: "records" }}
          />
        </View>
      </ScrollView>

      <ResidentMedicalDetailsDialog
        visible={detail.isOpen}
        record={detail.record}
        form={detail.form}
        loading={detail.loading}
        error={detail.error}
        onRetry={detail.retry}
        onClose={list.close}
      />
    </View>
  );
};

export default ResidentRecordsScreen;
