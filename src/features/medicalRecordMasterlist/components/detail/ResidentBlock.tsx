import { View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { formatCalendarDay, LINKAGE_DESCRIPTIONS } from "../../masterlistLabels";
import type { Linkage, ResidentIdentity } from "../../types";
import { LinkagePill } from "../MasterlistPills";

type Props = { resident: ResidentIdentity; linkage: Linkage; onShowHistory?: () => void };

const capitalize = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : "Not recorded");

/** Who the record belongs to, and whether it reaches their account. */
const ResidentBlock = ({ resident, linkage, onShowHistory }: Props) => {
  const palette = useQueuePalette();
  const adminPalette = useAdminSurfacePalette();
  return (
    <Block title="Resident" palette={palette}>
      <Row label="Name" value={resident.fullName || "Not recorded"} palette={palette} />
      <Row label="Birth date" value={formatCalendarDay(resident.dateOfBirth)} palette={palette} />
      <Row label="Sex" value={capitalize(resident.sex)} palette={palette} />
      {resident.purok ? <Row label="Purok" value={resident.purok} palette={palette} /> : null}
      {resident.masterResidentId ? <Row label="Master list ID" value={resident.masterResidentId} palette={palette} /> : null}
      <View className="gap-2 py-2">
        <View className="flex-row">
          <LinkagePill linkage={linkage} />
        </View>
        <Row label="Account" value={LINKAGE_DESCRIPTIONS[linkage]} palette={palette} />
      </View>
      {onShowHistory && resident.masterResidentId ? (
        <View className="items-start pb-2">
          <DashboardButton palette={adminPalette} size="sm" variant="secondary" icon="list" label="View all records for this resident" onPress={onShowHistory} />
        </View>
      ) : null}
    </Block>
  );
};

export default ResidentBlock;
