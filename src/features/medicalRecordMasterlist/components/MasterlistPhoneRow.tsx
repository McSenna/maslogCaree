import { immunizationProgressLabel } from "@/services/immunizationRecordProgress";
import { memo } from "react";
import { Text, View } from "react-native";

import { CardSide } from "@/components/dashboard/kit/TableCard";

import MedicalRecordActions, { type MedicalRecordActionHandlers } from "./MedicalRecordActions";
import { formatVisitDate } from "../masterlistLabels";
import type { MasterlistRow } from "../types";
import { LinkagePill, SourcePill } from "./MasterlistPills";
import { providerOf, residentLineOf, residentNameOf } from "./rowText";

type Props = MedicalRecordActionHandlers & {row:MasterlistRow;first:boolean};

const MasterlistPhoneRow = ({ row, first, ...actions }: Props) => {
  const name = residentNameOf(row);
  const visit = formatVisitDate(row.source, row.visitDate);

  return (
    <View className="mx-4">
      <CardSide>
        <View className={`gap-2.5 px-1 py-3 ${first ? "" : "border-t border-divider"}`}>
          <View className="gap-0.5">
            <Text className="text-[17px] font-semibold text-ink">{name}</Text>
            <Text className="text-[14px] text-text2" selectable>
              {residentLineOf(row)}
            </Text>
          </View>
          <Text className="text-[15px] text-body">{`${row.serviceLabel}, ${visit}`}</Text>
          {row.recordStatus ? <Text className="text-[15px] font-semibold text-ink">{immunizationProgressLabel(row)}</Text> : null}
          <Text className="text-[15px] text-body">{providerOf(row)}</Text>
          <View className="flex-row flex-wrap gap-2">
            <SourcePill source={row.source} />
            <LinkagePill linkage={row.linkage} />
          </View>
          <MedicalRecordActions row={row} placement="card" {...actions} />
        </View>
      </CardSide>
    </View>
  );
};

export default memo(MasterlistPhoneRow);
