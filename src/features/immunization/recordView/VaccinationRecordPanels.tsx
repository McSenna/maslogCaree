import { useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import type { EmptyAction } from "@/components/data-table/types";
import type { CompletionForm, MedicalRecord } from "@/services/medicalRecords";

import BabyRenameField from "../components/BabyRenameField";
import VaccinationDoseModal from "../components/VaccinationDoseModal";
import type { Checklist } from "../types";
import FocusableTabPanel from "./FocusableTabPanel";
import PersonSummaryBlock, { type SummaryShortcut } from "./PersonSummaryBlock";
import RecordEditNotices from "./RecordEditNotices";
import { useVaccinationRecord } from "./useVaccinationRecord";
import { panelPropsOf, type VaccinationTabsState } from "./useVaccinationTabs";
import VaccinationDetailsPanel from "./VaccinationDetailsPanel";
import VaccinationHistoryTable from "./VaccinationHistoryTable";
import type { VaccinationPeople } from "./vaccinationTypes";

export type VaccinationRecordPanelsProps = {
  record: MedicalRecord;
  form: CompletionForm | null;
  tabs: VaccinationTabsState;
  motherMasterResidentId?: string | null;
  peopleOf: (checklist: Checklist | null) => VaccinationPeople;
  parentShortcuts?: SummaryShortcut[];
  /** Takes the read checklist: a visit record only learns its baby from it. */
  babyShortcutsOf?: (checklist: Checklist | null) => SummaryShortcut[];
  /** Offered when this record has no doses of its own to show. */
  emptyAction?: EmptyAction;
  /** The record's own summary, above the people on Overview. */
  leading?: ReactNode;
  /** The record's other sections, kept on Overview below the history. */
  trailing?: ReactNode;
  /** On Overview once the baby's ledger has loaded: what the viewer can do with it. */
  checklistFooter?: (checklist: Checklist, reload: () => Promise<void>) => ReactNode;
  /** Set when a midwife is editing: doses open the dose modal, and the baby's name can change. */
  editing?: { busy: boolean };
};

/** The two tabs' content for one immunization record, both drawn from one read. */
const VaccinationRecordPanels = ({
  record,
  form,
  tabs,
  motherMasterResidentId,
  peopleOf,
  parentShortcuts = [],
  babyShortcutsOf,
  emptyAction,
  leading,
  trailing,
  checklistFooter,
  editing,
}: VaccinationRecordPanelsProps) => {
  const view = useVaccinationRecord({ record, form, motherMasterResidentId });
  const [openDoseKey, setOpenDoseKey] = useState<string | null>(null);
  const { checklist } = view;
  const openDose = checklist && openDoseKey ? (checklist.doses.find((dose) => dose.key === openDoseKey) ?? null) : null;
  const reload = async () => view.retry();
  const people = peopleOf(checklist);
  const showDetails: SummaryShortcut = { label: "View vaccination details", icon: "shield", onPress: () => tabs.select("details") };

  const content =
    tabs.tab === "details" ? (
      <FocusableTabPanel baseId={tabs.baseId}>
        <VaccinationDetailsPanel view={view} tabs={tabs} emptyAction={emptyAction} onOpenDose={editing ? setOpenDoseKey : undefined} />
      </FocusableTabPanel>
    ) : (
      <View {...panelPropsOf(tabs.baseId, "overview")} style={styles.panel}>
        {leading}
        {editing && checklist ? <RecordEditNotices checklist={checklist} onReload={reload} busy={editing.busy} /> : null}
        <View style={styles.people}>
          <PersonSummaryBlock person={people.parent} shortcuts={parentShortcuts} />
          <PersonSummaryBlock person={people.baby} shortcuts={[showDetails, ...(babyShortcutsOf?.(checklist) ?? [])]}>
            {editing && checklist?.baby.temporaryName ? <BabyRenameField checklist={checklist} onReload={reload} disabled={editing.busy} /> : null}
          </PersonSummaryBlock>
        </View>
        <VaccinationHistoryTable
          view={view}
          onViewDetails={tabs.viewEntry}
          emptyAction={emptyAction}
          doseSelection={editing ? { onSelect: setOpenDoseKey, disabled: editing.busy } : undefined}
        />
        {trailing}
        {checklist && checklistFooter ? checklistFooter(checklist, reload) : null}
      </View>
    );

  return (
    <>
      {content}
      {editing && checklist && openDose ? (
        <VaccinationDoseModal
          key={`${checklist.baby._id}-${openDose.key}`}
          checklist={checklist}
          dose={openDose}
          canEdit={!editing.busy}
          onSaved={reload}
          onClose={() => setOpenDoseKey(null)}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  panel: { gap: 16 },
  people: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
});

export default VaccinationRecordPanels;
