import { Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { Block, Row } from "@/components/medicalRecord/details/RecordPrimitives";
import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import Checkbox from "@/components/ui/Checkbox";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { formatCalendarDay } from "../../masterlistLabels";
import type { ResidentIdentity } from "../../types";

type Props = {
  resident: ResidentIdentity;
  confirmed: boolean;
  onConfirmedChange?: (next: boolean) => void;
  onChange?: () => void;
};

const capitalize = (value: string) => (value ? value[0].toUpperCase() + value.slice(1) : "Not recorded");

/**
 * The person this record will be filed under. A missing account never blocks
 * saving: the record waits on the master list until an account is linked.
 */
const ResidentSummary = ({ resident, confirmed, onConfirmedChange, onChange }: Props) => {
  const palette = useQueuePalette();
  const buttons = useAdminSurfacePalette();
  const account = resident.hasAccount ? "Has an account. The record shows there once saved." : "No account yet. The record is kept and shows once an account is linked.";

  return (
    <View className="gap-3">
      <Block title="Master list record" palette={palette}>
        <Row label="Name" value={resident.fullName} palette={palette} />
        <Row label="Master list ID" value={resident.masterResidentId ?? "Not recorded"} palette={palette} />
        <Row label="Birth date" value={formatCalendarDay(resident.dateOfBirth)} palette={palette} />
        <Row label="Sex" value={capitalize(resident.sex)} palette={palette} />
        {resident.purok ? <Row label="Purok" value={resident.purok} palette={palette} /> : null}
        <Row label="Account" value={account} palette={palette} />
      </Block>
      {onConfirmedChange ? (
        <View className="flex-row items-start gap-3">
          <View className="pt-0.5">
            <Checkbox
              checked={confirmed}
              onChange={onConfirmedChange}
              accessibilityLabel={`The name and birth date match the paper record for ${resident.fullName}`}
            />
          </View>
          <Text className="min-w-0 flex-1 text-[13px] leading-[19px]" style={{ color: palette.body }} onPress={() => onConfirmedChange(!confirmed)}>
            The name and birth date match the paper record.
          </Text>
        </View>
      ) : null}
      {onChange ? (
        <View className="items-start">
          <DashboardButton palette={buttons} size="sm" variant="secondary" icon="repeat" label="Choose another resident" onPress={onChange} />
        </View>
      ) : null}
    </View>
  );
};

export default ResidentSummary;
