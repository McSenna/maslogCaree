import { immunizationProgressLabel } from "@/services/immunizationRecordProgress";
import { View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import {
  ClinicalBlock,
  FollowUpBlock,
  ItemsGivenBlock,
  ServiceDetailsBlock,
} from "@/components/medicalRecord/details/RecordDetailSections";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";

import { formatVisitDate, recordReference, SOURCE_LABELS } from "../../masterlistLabels";
import type { MasterlistDetail } from "../../types";
import { providerOf } from "../rowText";
import RecordHistoryBlock from "./RecordHistoryBlock";
import ResidentBlock from "./ResidentBlock";

type Props = { detail: MasterlistDetail; onShowHistory?: () => void };

/** The full record for staff, including the care team's private notes and its history. */
const RecordDetailContent = ({ detail, onShowHistory }: Props) => {
  const basePalette = useQueuePalette();
  // This ongoing clinical record needs readable section labels in both themes.
  const palette = detail.baby ? { ...basePalette, subtle: basePalette.body } : basePalette;
  const { record, form } = detail;

  return (
    <View className="w-full gap-4">
      <ResidentBlock resident={detail.resident} linkage={detail.linkage} onShowHistory={onShowHistory} />
      <Block title="Visit" palette={palette}>
        <Row label="Reference" value={recordReference(detail._id)} palette={palette} />
        <Row label="Visit date" value={formatVisitDate(detail.source, detail.visitDate)} palette={palette} />
        <Row label="Service" value={detail.serviceLabel} palette={palette} />
        <Row label="Source" value={SOURCE_LABELS[detail.source]} palette={palette} />
        <Row label="Provider" value={providerOf(detail)} palette={palette} />
        {record.visitReason ? <Row label="Reason for visit" value={record.visitReason} palette={palette} /> : null}
      </Block>
      {detail.baby ? <Block title="Baby immunization program" palette={palette}>
        <Row label="Baby" value={detail.baby.name} palette={palette} />
        <Row label="Baby ID" value={detail.baby._id} palette={palette} />
        <Row label="Date of birth" value={detail.baby.dateOfBirth} palette={palette} />
        <Row label="Status" value={immunizationProgressLabel(detail) || "In progress"} palette={palette} />
        <Row label="Schedule version" value={record.immunizationScheduleVersion || "Not recorded"} palette={palette} />
        <Row label="Recording doses" value="Open each saved dose to view details. Midwives can use Edit record to continue drafts or make an audited correction." palette={palette} />
      </Block> : null}
      <ServiceDetailsBlock record={record} form={form} palette={palette} />
      <ClinicalBlock record={record} palette={palette} />
      {record.notes ? (
        <Block title="Care team notes" palette={palette}>
          <Row label="Not shown to the resident" value={record.notes} palette={palette} />
        </Block>
      ) : null}
      <ItemsGivenBlock record={record} palette={palette} />
      <FollowUpBlock record={record} palette={palette} />
      <RecordHistoryBlock detail={detail} />
    </View>
  );
};

export default RecordDetailContent;
