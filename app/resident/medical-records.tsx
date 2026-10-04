import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, SectionList, Text, View } from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { ResidentMedicalDetailsDialog } from "@/features/medical-records/components/ResidentMedicalDetailsDialog";
import MedicalRecordCard from "@/components/medicalRecord/history/MedicalRecordCard";
import MedicalRecordEmptyState from "@/components/medicalRecord/history/MedicalRecordEmptyState";
import MedicalRecordFilters from "@/components/medicalRecord/history/MedicalRecordFilters";
import MedicalRecordSkeleton from "@/components/medicalRecord/history/MedicalRecordSkeleton";
import RecordYearHeader from "@/components/medicalRecord/history/RecordYearHeader";
import { groupRecordsByYear } from "@/components/medicalRecord/history/recordYearSections";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { INITIAL_RECORD_FILTERS, useResidentMedicalRecords } from "@/hooks/useResidentMedicalRecords";

const ResidentMedicalRecords = () => {
  const { classes } = useTheme();
  const palette = useQueuePalette();
  const history = useResidentMedicalRecords();
  const { records, loading, error, viewer } = history;
  const sections = useMemo(() => groupRecordsByYear(records), [records]);

  const emptyState = () => {
    if (loading) return <MedicalRecordSkeleton palette={palette} />;
    if (error) return <MedicalRecordEmptyState variant="error" palette={palette} onRetry={history.refetch} />;
    if (history.filtered) {
      return <MedicalRecordEmptyState variant="no-matches" palette={palette} onClearFilters={() => history.setFilters(INITIAL_RECORD_FILTERS)} />;
    }
    return <MedicalRecordEmptyState variant="no-records" palette={palette} />;
  };

  const header = (
    <View className="gap-5 pb-2">
      <View className="gap-1">
        <PageTitle>Medical Record History</PageTitle>
        <PageSubtitle>
          Your visits to the Maslog health center, including records from before you joined MaslogCare. New visits
          appear here once your appointment is closed.
        </PageSubtitle>
      </View>

      {records.length || history.filtered ? (
        <MedicalRecordFilters value={history.filters} onChange={history.setFilters} palette={palette} resultCount={history.total} />
      ) : null}

      {error && records.length ? (
        <Pressable
          onPress={history.refetch}
          accessibilityRole="button"
          accessibilityLabel="Records may be out of date. Tap to retry."
          className="w-full flex-row items-center gap-2.5 rounded-xl px-3.5 py-2.5 active:opacity-80"
          style={{ backgroundColor: palette.statuses.pending.bg }}
        >
          <Feather name="refresh-cw" size={14} color={palette.statuses.pending.dot} />
          <Text className="min-w-0 flex-1 text-[12.5px] font-medium" style={{ color: palette.statuses.pending.fg }}>
            These records may be out of date. Tap to try again.
          </Text>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <>
      <SectionList
        className={`flex-1 ${classes.scrollBg}`}
        sections={loading ? [] : sections}
        keyExtractor={(record) => record._id}
        renderItem={({ item }) => <MedicalRecordCard record={item} palette={palette} onOpen={(row) => void viewer.open(row)} />}
        renderSectionHeader={({ section }) => <RecordYearHeader title={section.title} palette={palette} />}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={header}
        ListEmptyComponent={emptyState()}
        ListFooterComponent={
          history.loadingMore ? (
            <View className="items-center py-4">
              <ActivityIndicator color={palette.primary} accessibilityLabel="Loading more records" />
            </View>
          ) : (
            <View className="h-8" />
          )
        }
        onEndReached={history.hasMore ? history.loadMore : undefined}
        onEndReachedThreshold={0.4}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      <ResidentMedicalDetailsDialog
        visible={viewer.isOpen}
        record={viewer.record}
        form={viewer.form}
        loading={viewer.loading}
        error={viewer.error}
        onRetry={viewer.retry}
        onClose={viewer.close}
      />
    </>
  );
};

export default ResidentMedicalRecords;
