import { Text, View } from "react-native";
import { initialsOf, type QueuePalette } from "@/components/appointmentQueue/queueTheme";
import type { MedicalRecord } from "@/services/medicalRecords";
import { DetailRow, RecordSection } from "@/components/ui/DetailSection";
import { getServiceVisual, resolveVisual } from "@/config/serviceVisuals";
import {
  providerNameOf,
  providerRoleLabelOf,
  serviceLabelOf,
} from "./recordPresenter";

const ProviderInformation = ({
  record,
  palette,
}: {
  record: MedicalRecord;
  palette: QueuePalette;
}) => {
  const name = providerNameOf(record);
  const role = providerRoleLabelOf(record);
  if (!name && !role) return null;

  const visual = resolveVisual(getServiceVisual(record.serviceType), palette.isDark);

  return (
    <RecordSection title="Healthcare Provider" palette={palette}>
      <View className="w-full">
        <View
          className="w-full flex-row items-center gap-3 px-3.5 py-3"
          style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
        >
          <View
            className="items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: visual.tint }}
          >
            <Text className="text-[14px] font-bold" style={{ color: visual.fg }}>
              {initialsOf(name)}
            </Text>
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
              {name || "Assigned health worker"}
            </Text>
            {role ? (
              <Text className="text-[12.5px]" style={{ color: palette.muted }}>
                {role}
              </Text>
            ) : null}
          </View>
        </View>

        <DetailRow label="Service handled" value={serviceLabelOf(record)} palette={palette} last />
      </View>
    </RecordSection>
  );
};

export default ProviderInformation;
