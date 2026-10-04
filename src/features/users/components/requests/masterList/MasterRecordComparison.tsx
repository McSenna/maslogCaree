import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { DETAIL_RADIUS, useUserDetailsPalette } from "../../details/detailsTheme";
import type {
  MasterListReason,
  MasterResidentRecord,
  UserRequestResident,
} from "../../../services/userRequestTypes";
import { buildComparisonRows, type ComparisonRow } from "./masterListComparison";

type Props = {
  resident: UserRequestResident;
  record: MasterResidentRecord;
  reasons: MasterListReason[];
};

// Semantic table (as in the dashboard DataTable) so a screen reader pairs each
// value with its column, even though the label sits above the values visually.
const ComparisonLine = ({ row, divided }: { row: ComparisonRow; divided: boolean }) => {
  const palette = useUserDetailsPalette();
  const flag = palette.statuses.pending;

  return (
    <View
      role="row"
      className="gap-1 py-2"
      style={divided ? { borderTopWidth: 1, borderTopColor: palette.divider } : undefined}
    >
      <View role="rowheader" className="flex-row flex-wrap items-center gap-2">
        <Text className="text-[12px] font-semibold" style={{ color: palette.muted }}>
          {row.label}
        </Text>
        {row.differs ? (
          <View className="flex-row items-center gap-1">
            <Feather name="alert-circle" size={12} color={flag.text} />
            <Text className="text-[12px] font-semibold" style={{ color: flag.text }}>
              Differs
            </Text>
          </View>
        ) : null}
      </View>
      <View className="flex-row gap-3">
        <Text role="cell" className="min-w-0 flex-1 text-[13px]" style={{ color: palette.body }}>
          {row.submitted}
        </Text>
        <Text
          role="cell"
          className="min-w-0 flex-1 text-[13px] font-semibold"
          style={{ color: palette.heading }}
        >
          {row.record}
        </Text>
      </View>
    </View>
  );
};

const MasterRecordComparison = ({ resident, record, reasons }: Props) => {
  const palette = useUserDetailsPalette();
  const rows = record.missing ? [] : buildComparisonRows(resident, record, reasons);

  return (
    <View
      className="px-3 py-2"
      style={{
        borderRadius: DETAIL_RADIUS.card,
        borderWidth: 1,
        borderColor: palette.neutralBorder,
        backgroundColor: palette.cardBg,
      }}
    >
      <View className="flex-row flex-wrap items-center justify-between gap-2 pb-1">
        <Text className="text-[12px] font-bold" style={{ color: palette.heading }} selectable>
          Record {record.masterResidentId}
        </Text>
        {record.isActive === false ? (
          <Text className="text-[12px]" style={{ color: palette.subtle }}>
            Marked inactive
          </Text>
        ) : null}
      </View>

      {record.missing ? (
        <Text className="py-2 text-[13px]" style={{ color: palette.body }}>
          This record is no longer on the master list.
        </Text>
      ) : (
        <View role="table" accessibilityLabel={`Record ${record.masterResidentId} compared with this registration`}>
          <View role="row" className="flex-row gap-3 pt-1">
            <Text role="columnheader" className="absolute h-px w-px overflow-hidden">
              Detail
            </Text>
            <Text role="columnheader" className="flex-1 text-[12px] font-semibold" style={{ color: palette.subtle }}>
              Registration
            </Text>
            <Text role="columnheader" className="flex-1 text-[12px] font-semibold" style={{ color: palette.subtle }}>
              Master list
            </Text>
          </View>
          {rows.map((row, index) => (
            <ComparisonLine key={row.key} row={row} divided={index > 0} />
          ))}
        </View>
      )}
    </View>
  );
};

export default MasterRecordComparison;
