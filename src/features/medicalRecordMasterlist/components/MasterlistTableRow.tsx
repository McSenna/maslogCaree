import { memo } from "react";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { CardSide } from "@/components/dashboard/kit/TableCard";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { formatVisitDate } from "../masterlistLabels";
import type { MasterlistRow } from "../types";
import { MASTERLIST_COLUMN, type MasterlistTableMode } from "./masterlistColumns";
import { LinkagePill, SourcePill } from "./MasterlistPills";
import { providerOf, residentLineOf, residentNameOf, serviceLineOf } from "./rowText";

type Props = {
  row: MasterlistRow;
  first: boolean;
  mode: MasterlistTableMode;
  onView: (id: string) => void;
};

const MasterlistTableRow = ({ row, first, mode, onView }: Props) => {
  const palette = useAdminSurfacePalette();
  const name = residentNameOf(row);
  const visit = formatVisitDate(row.source, row.visitDate);

  return (
    <CardSide>
      <View className={`min-h-16 flex-row items-center gap-3 px-3 py-2.5 ${first ? "" : "border-t border-divider"}`}>
        <View className={MASTERLIST_COLUMN.resident}>
          <Text numberOfLines={2} className="text-[13.5px] font-semibold text-ink">
            {name}
          </Text>
          <Text numberOfLines={2} className="text-[12px] text-text2" selectable>
            {residentLineOf(row)}
          </Text>
        </View>
        <Text className={`${MASTERLIST_COLUMN.visit} text-[13px] text-body`}>{visit}</Text>
        <View className={MASTERLIST_COLUMN.service}>
          <Text numberOfLines={1} className="text-[13px] font-medium text-body">
            {row.serviceLabel}
          </Text>
          {mode === "compact" ? (
            <Text numberOfLines={2} className="text-[12px] text-text2">
              {serviceLineOf(row)}
            </Text>
          ) : null}
        </View>
        {mode === "full" ? (
          <Text numberOfLines={2} className={`${MASTERLIST_COLUMN.provider} text-[13px] text-body`}>
            {providerOf(row)}
          </Text>
        ) : null}
        {mode === "full" ? (
          <View className={`${MASTERLIST_COLUMN.source} items-start`}>
            <SourcePill source={row.source} />
          </View>
        ) : null}
        <View className={`${MASTERLIST_COLUMN.linkage} items-start`}>
          <LinkagePill linkage={row.linkage} />
        </View>
        <View className={MASTERLIST_COLUMN.actions}>
          <DashboardButton
            palette={palette}
            size="sm"
            icon="file-text"
            label="View"
            accessibilityLabel={`View the ${row.serviceLabel} record for ${name}, ${visit}`}
            onPress={() => onView(row._id)}
          />
        </View>
      </View>
    </CardSide>
  );
};

export default memo(MasterlistTableRow);
