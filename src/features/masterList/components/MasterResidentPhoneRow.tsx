import { memo, type ComponentProps } from "react";
import { Text, View } from "react-native";

import { CardSide } from "@/components/dashboard/kit/TableCard";
import { civilStatusLabel } from "@/config/civilStatus";

import MasterRecordActions from "./MasterRecordActions";

import { capitalize, formatBirthDate, masterListName } from "../masterResidentForm";
import { ResidentRolePill } from "./MasterRecordPills";

type Props = ComponentProps<typeof MasterRecordActions> & { first: boolean };

const MasterResidentPhoneRow = ({ record, first, ...actions }: Props) => {
  const name = masterListName(record);
  const facts = [formatBirthDate(record.dateOfBirth), capitalize(record.sex), civilStatusLabel(record.civilStatus)]
    .filter(Boolean)
    .join(" · ");

  return (
    <View className="mx-4">
      <CardSide>
        <View className={`gap-2.5 px-1 py-3 ${first ? "" : "border-t border-divider"}`}>
          <Text className="font-semibold text-ink" style={{ fontSize: 17 }}>{name}</Text>
          <Text className="text-body" style={{ fontSize: 15 }}>{facts}</Text>
          <Text className="text-body" style={{ fontSize: 15 }}>{record.address}</Text>
          <View className="flex-row flex-wrap gap-2">
            <ResidentRolePill role={record.role} />
          </View>
          <MasterRecordActions record={record} {...actions} />
        </View>
      </CardSide>
    </View>
  );
};

export default memo(MasterResidentPhoneRow);
