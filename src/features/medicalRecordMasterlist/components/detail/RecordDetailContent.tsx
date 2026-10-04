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
  const palette = useQueuePalette();
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
