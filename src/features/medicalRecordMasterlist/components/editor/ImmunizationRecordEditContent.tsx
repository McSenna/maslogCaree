import { View } from "react-native";

import type { VaccinationTabsState } from "@/features/immunization/recordView/useVaccinationTabs";
import { peopleFromMasterlist } from "@/features/immunization/recordView/vaccinationPeople";
import VaccinationRecordPanels from "@/features/immunization/recordView/VaccinationRecordPanels";

import type { MasterlistDetail } from "../../types";

type Props = { detail: MasterlistDetail; tabs: VaccinationTabsState; busy: boolean };

/** A baby's record while editing: the same panels as viewing it, with doses that can be opened. */
const ImmunizationRecordEditContent = ({ detail, tabs, busy }: Props) => (
  <View testID="immunization-record-fields">
    <VaccinationRecordPanels
      record={detail.record}
      form={detail.form}
      tabs={tabs}
      motherMasterResidentId={detail.resident.masterResidentId}
      peopleOf={(checklist) => peopleFromMasterlist(detail, checklist)}
      editing={{ busy }}
    />
  </View>
);

export default ImmunizationRecordEditContent;
