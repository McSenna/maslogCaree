import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { DataTable } from "@/components/data-table";
import type { EmptyAction } from "@/components/data-table/types";
import { ErrorBanner } from "@/components/medicalRecord/complete/CompletionChrome";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { BREAKPOINTS } from "@/theme/breakpoints";
import { RADII } from "@/theme/radius";
import { TYPE } from "@/theme/typography";

import ChecklistGrid from "../components/ChecklistGrid";
import type { VaccinationRecordState } from "./useVaccinationRecord";
import { vaccinationColumns } from "./vaccinationColumns";
import { vaccinationEmptyCopy } from "./vaccinationEmptyCopy";
import VisitCareSection from "./VisitCareSection";

type Props = {
  view: VaccinationRecordState;
  onViewDetails: (entryId: string) => void;
  emptyAction?: EmptyAction;
  /** Editing only: every dose can be selected, including one with no record yet. */
  doseSelection?: { onSelect: (doseKey: string) => void; disabled: boolean };
};

const VaccinationHistoryTable = ({ view, onViewDetails, emptyAction, doseSelection }: Props) => {
  const palette = useAdminSurfacePalette();
  const columns = useMemo(() => vaccinationColumns(onViewDetails), [onViewDetails]);
  const empty = vaccinationEmptyCopy(view);
  const counts = view.counts;
  const checklist = view.checklist;
  const note = view.nextDoseNote ? <Text style={[styles.note, { color: palette.body }]}>{view.nextDoseNote}</Text> : undefined;
  // A saved dose whose key left the schedule has no cell in the grid, so it keeps a row.
  const outsideSchedule = checklist ? view.entries.filter((entry) => !checklist.doses.some((dose) => dose.key === entry.id)) : [];

  const body = () => {
    if (view.loading) return <Skeleton accessibilityLabel="Loading vaccination history" style={styles.skeleton} />;
    if (checklist) {
      return (
        <>
          {view.error ? <ErrorBanner message={`These doses may be out of date. ${view.error}`} /> : null}
          <ChecklistGrid
            checklist={checklist}
            readOnly={!doseSelection}
            disabled={doseSelection?.disabled}
            ageGroupHeader={false}
            hoverPreview={false}
            gridFrom={BREAKPOINTS.desktop}
            onSelect={(dose) => (doseSelection ? doseSelection.onSelect(dose.key) : onViewDetails(dose.key))}
          />
          {note}
          {outsideSchedule.length ? (
            <DataTable caption="Saved doses outside this schedule" columns={columns} data={outsideSchedule} rowKey={(entry) => entry.id} />
          ) : null}
        </>
      );
    }
    return (
      <DataTable
        caption="Vaccination History"
        columns={columns}
        data={view.entries}
        rowKey={(entry) => entry.id}
        loading={view.loading}
        error={view.error}
        errorTitle="Could not load the vaccination history."
        onRetry={view.retry}
        emptyIcon={empty.icon}
        emptyTitle={empty.title}
        emptyDescription={empty.description}
        emptyAction={emptyAction}
      />
    );
  };

  return (
    <View style={styles.section}>
      {view.visit ? <VisitCareSection view={view} columns={columns} /> : null}
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={[styles.title, { color: palette.heading }]}>
          Vaccination History
        </Text>
        {counts ? (
          <Text style={[styles.count, { color: palette.body }]}>
            {counts.administered} of {counts.total} doses administered
          </Text>
        ) : null}
      </View>
      {view.visit ? <Text style={[styles.note, { color: palette.body }]}>The baby&apos;s full record across all visits.</Text> : null}
      {body()}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { gap: 8 },
  heading: { flexDirection: "row", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", columnGap: 12, rowGap: 4 },
  title: { ...TYPE.bodyStrong, fontWeight: "700" },
  count: { ...TYPE.caption },
  note: { ...TYPE.caption },
  skeleton: { height: 420, borderRadius: RADII.large },
});

export default VaccinationHistoryTable;
