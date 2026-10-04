import { memo } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import type { MasterResidentRecord } from "../masterList.types";
import { capitalize, formatBirthDate, masterFullName } from "../masterResidentForm";
import { MASTER_COLUMN, type MasterTableMode } from "./masterColumns";
import { AccountLinkPill, RecordStatusPill } from "./MasterRecordPills";

type Props = {
  record: MasterResidentRecord;
  first: boolean;
  mode: MasterTableMode;
  onEdit: (record: MasterResidentRecord) => void;
  onToggleActive: (record: MasterResidentRecord) => void;
};

/** The line under the name: the record ID, plus whatever columns this width folds in. */
const secondLine = (record: MasterResidentRecord, mode: MasterTableMode) => {
  if (mode === "full") return record.masterResidentId;
  const folded =
    mode === "tablet" ? [formatBirthDate(record.dateOfBirth), capitalize(record.sex), capitalize(record.civilStatus)] : [];
  return [record.masterResidentId, ...folded, record.address].join(" · ");
};

const MasterResidentTableRow = ({ record, first, mode, onEdit, onToggleActive }: Props) => {
  const palette = useAdminSurfacePalette();
  const name = masterFullName(record);

  return (
    <CardSide>
      <View className={`min-h-16 flex-row items-center gap-3 px-3 py-2.5 ${first ? "" : "border-t border-divider"}`}>
        <View className={MASTER_COLUMN.resident}>
          <Text numberOfLines={2} className="text-[13.5px] font-semibold text-ink">
            {name}
          </Text>
          <Text numberOfLines={2} className="text-[12px] text-text2" selectable>
            {secondLine(record, mode)}
          </Text>
        </View>
        {mode === "tablet" ? null : <Text className={`${MASTER_COLUMN.birth} text-[13px] text-body`}>{formatBirthDate(record.dateOfBirth)}</Text>}
        {mode === "tablet" ? null : <Text className={`${MASTER_COLUMN.sex} text-[13px] text-body`}>{capitalize(record.sex)}</Text>}
        {mode === "tablet" ? null : <Text className={`${MASTER_COLUMN.civil} text-[13px] text-body`}>{capitalize(record.civilStatus)}</Text>}
        {mode === "full" ? (
          <Text numberOfLines={2} className={`${MASTER_COLUMN.address} text-[13px] leading-[18px] text-body`}>
            {record.address}
          </Text>
        ) : null}
        <View className={`${MASTER_COLUMN.account} items-start`}>
          <AccountLinkPill linked={record.linkedAccount} />
        </View>
        <View className={`${MASTER_COLUMN.status} items-start`}>
          <RecordStatusPill active={record.isActive} />
        </View>
        <View className={`${MASTER_COLUMN.actions} flex-row justify-end gap-2`}>
          <DashboardButton palette={palette} size="sm" icon="edit-2" label="Edit" accessibilityLabel={`Edit the record for ${name}`} onPress={() => onEdit(record)} />
          <DashboardButton
            palette={palette}
            size="sm"
            variant={record.isActive ? "ghost" : "secondary"}
            label={record.isActive ? "Deactivate" : "Reactivate"}
            accessibilityLabel={`${record.isActive ? "Deactivate" : "Reactivate"} the record for ${name}`}
            onPress={() => onToggleActive(record)}
          />
        </View>
      </View>
    </CardSide>
  );
};

export default memo(MasterResidentTableRow);
