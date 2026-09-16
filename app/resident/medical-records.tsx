import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import MedicalRecordBottomSheet from "@/components/medicalRecord/history/MedicalRecordBottomSheet";
import MedicalRecordCard from "@/components/medicalRecord/history/MedicalRecordCard";
import MedicalRecordEmptyState from "@/components/medicalRecord/history/MedicalRecordEmptyState";
import MedicalRecordFilters, {
  type FilterState,
} from "@/components/medicalRecord/history/MedicalRecordFilters";
import MedicalRecordSkeleton from "@/components/medicalRecord/history/MedicalRecordSkeleton";
import { filterRecords } from "@/components/medicalRecord/history/recordPresenter";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useTheme } from "@/contexts/ThemeContext";
import { useResidentMedicalRecords } from "@/hooks/useResidentMedicalRecords";

const INITIAL_FILTERS: FilterState = { query: "", service: "all", range: "any" };

const ResidentMedicalRecords = () => {
  const { classes } = useTheme();
  const palette = useQueuePalette();
  const { records, loading, error, viewing, viewLoading, openRecord, closeRecord, refetch } =
    useResidentMedicalRecords();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const visible = useMemo(() => {
    const filtered = filterRecords(records, filters);
    return [...filtered].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }, [records, filters]);

  const body = () => {
    if (loading) return <MedicalRecordSkeleton palette={palette} />;

    if (error && !records.length) {
      return <MedicalRecordEmptyState variant="error" palette={palette} onRetry={refetch} />;
    }

    if (!records.length) {
      return <MedicalRecordEmptyState variant="no-records" palette={palette} />;
    }

    if (!visible.length) {
      return (
        <MedicalRecordEmptyState
          variant="no-matches"
          palette={palette}
          onClearFilters={() => setFilters(INITIAL_FILTERS)}
        />
      );
    }

    return (
      <View className="w-full gap-3">
        {visible.map((record) => (
          <MedicalRecordCard
            key={record._id}
            record={record}
            palette={palette}
            onOpen={(r) => void openRecord(r)}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView
        className={`flex-1 ${classes.scrollBg}`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-5 pb-8">
          <View className="gap-1">
            <PageTitle>Medical Record History</PageTitle>
            <PageSubtitle>
              Every completed visit, as your health worker recorded it. Records appear here
              automatically once an appointment is closed.
            </PageSubtitle>
          </View>

          {records.length ? (
            <MedicalRecordFilters
              value={filters}
              onChange={setFilters}
              palette={palette}
              resultCount={visible.length}
            />
          ) : null}

          {error && records.length ? (
            <Pressable
              onPress={refetch}
              accessibilityRole="button"
              accessibilityLabel="Records may be out of date. Tap to retry."
              className="w-full flex-row items-center gap-2.5 rounded-xl px-3.5 py-2.5 active:opacity-80"
              style={{ backgroundColor: palette.statuses.pending.bg }}
            >
              <Feather name="refresh-cw" size={14} color={palette.statuses.pending.dot} />
              <Text
                className="min-w-0 flex-1 text-[12.5px] font-medium"
                style={{ color: palette.statuses.pending.fg }}
              >
                These records may be out of date. Tap to try again.
              </Text>
            </Pressable>
          ) : null}

          {body()}
        </View>
      </ScrollView>

      <MedicalRecordBottomSheet
        visible={Boolean(viewing)}
        record={viewing?.record ?? null}
        form={viewing?.form ?? null}
        loading={viewLoading}
        onClose={closeRecord}
      />
    </>
  );
};

export default ResidentMedicalRecords;
