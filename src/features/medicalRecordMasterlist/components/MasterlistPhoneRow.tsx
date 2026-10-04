import { memo } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { formatVisitDate } from "../masterlistLabels";
import type { MasterlistRow } from "../types";
import { LinkagePill, SourcePill } from "./MasterlistPills";
import { providerOf, residentLineOf, residentNameOf } from "./rowText";

type Props = { row: MasterlistRow; first: boolean; onView: (id: string) => void };

const MasterlistPhoneRow = ({ row, first, onView }: Props) => {
  const palette = useAdminSurfacePalette();
  const name = residentNameOf(row);
  const visit = formatVisitDate(row.source, row.visitDate);

  return (
    <View className="mx-4">
      <CardSide>
        <View className={`gap-2.5 px-1 py-3 ${first ? "" : "border-t border-divider"}`}>
          <View className="gap-0.5">
            <Text className="text-[15px] font-semibold text-ink">{name}</Text>
            <Text className="text-[12px] text-text2" selectable>
              {residentLineOf(row)}
            </Text>
          </View>
          <Text className="text-[13px] text-body">{`${row.serviceLabel}, ${visit}`}</Text>
          <Text className="text-[13px] text-body">{providerOf(row)}</Text>
          <View className="flex-row flex-wrap gap-2">
            <SourcePill source={row.source} />
            <LinkagePill linkage={row.linkage} />
          </View>
          <DashboardButton
            palette={palette}
            size="md"
            fullWidth
            icon="file-text"
            label="View record"
            accessibilityLabel={`View the ${row.serviceLabel} record for ${name}, ${visit}`}
            onPress={() => onView(row._id)}
          />
        </View>
      </CardSide>
    </View>
  );
};

export default memo(MasterlistPhoneRow);
