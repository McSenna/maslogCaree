import { View } from "react-native";

import { DATE_RANGES } from "@/components/medicalRecord/history/recordFilterOptions";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { SERVICE_TYPES } from "@/config/appointmentServices";
import { fromOption, serviceOptions, toOption } from "@/features/medicalRecordMasterlist/masterlistFilters";
import type { ResidentMedicalRecordsState } from "@/hooks/useResidentMedicalRecords";

const CONTROL_HEIGHT = 44;
const WIDE_SEARCH = { flex: 2, minWidth: 220 } as const;
const WIDE_SELECT = { flex: 1, minWidth: 206 } as const;
const FULL_ROW = { width: "100%" } as const;
const PHONE_SELECT = { flexGrow: 1, minWidth: 160 } as const;

const SERVICES = serviceOptions(SERVICE_TYPES.map((service) => ({ key: service.id, label: service.label })));
const RANGES = DATE_RANGES.map((range) => ({ value: range.key === "any" ? "all" : range.key, label: range.label }));

type Props = { list: ResidentMedicalRecordsState; phone: boolean };

/** The same controls as the staff list. The service filter stands in for the old category tabs. */
const ResidentRecordsToolbar = ({ list, phone }: Props) => {
  const select = phone ? PHONE_SELECT : WIDE_SELECT;

  return (
    <View className={phone ? "flex-row flex-wrap gap-2.5" : "flex-row flex-wrap items-center gap-3"}>
      <SearchField
        value={list.search}
        onChangeText={list.setSearch}
        placeholder="Search service or provider"
        accessibilityLabel="Search my medical records"
        style={phone ? FULL_ROW : WIDE_SEARCH}
      />
      <SelectMenu
        label="Filter by service"
        value={toOption(list.filters.service)}
        options={SERVICES}
        onChange={(value) => list.setFilters({ service: fromOption(value) })}
        height={CONTROL_HEIGHT}
        style={select}
      />
      <SelectMenu
        label="Filter by date"
        value={toOption(list.filters.range)}
        options={RANGES}
        onChange={(value) => list.setFilters({ range: fromOption(value) })}
        height={CONTROL_HEIGHT}
        style={select}
      />
    </View>
  );
};

export default ResidentRecordsToolbar;
