import { memo } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterResidentRecord } from "../masterList.types";
import { capitalize, formatBirthDate, masterFullName } from "../masterResidentForm";
import { AccountLinkPill, RecordStatusPill } from "./MasterRecordPills";

type Props = {
  record: MasterResidentRecord;
  first: boolean;
  onEdit: (record: MasterResidentRecord) => void;
  onToggleActive: (record: MasterResidentRecord) => void;
};

const MasterResidentPhoneRow = ({ record, first, onEdit, onToggleActive }: Props) => {
  const palette = useAdminSurfacePalette();
  const name = masterFullName(record);
  const facts = [formatBirthDate(record.dateOfBirth), capitalize(record.sex), capitalize(record.civilStatus)].join(" · ");

  return (
    <View className="mx-4">
      <CardSide>
        <View className={`gap-2.5 px-1 py-3 ${first ? "" : "border-t border-divider"}`}>
          <View className="gap-0.5">
            <Text className="text-[15px] font-semibold text-ink">{name}</Text>
            <Text className="text-[12px] text-text2" selectable>
              {record.masterResidentId}
            </Text>
          </View>
          <Text className="text-[13px] text-body">{facts}</Text>
          <Text className="text-[13px] text-body">{record.address}</Text>
          <View className="flex-row flex-wrap gap-2">
            <RecordStatusPill active={record.isActive} />
            <AccountLinkPill linked={record.linkedAccount} />
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <DashboardButton palette={palette} size="md" fullWidth icon="edit-2" label="Edit" accessibilityLabel={`Edit the record for ${name}`} onPress={() => onEdit(record)} />
            </View>
            <View className="flex-1">
              <DashboardButton
                palette={palette}
                size="md"
                fullWidth
                variant={record.isActive ? "ghost" : "secondary"}
                label={record.isActive ? "Deactivate" : "Reactivate"}
                accessibilityLabel={`${record.isActive ? "Deactivate" : "Reactivate"} the record for ${name}`}
                onPress={() => onToggleActive(record)}
              />
            </View>
          </View>
        </View>
      </CardSide>
    </View>
  );
};

export default memo(MasterResidentPhoneRow);
