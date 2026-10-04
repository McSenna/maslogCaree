import { View } from "react-native";

import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import type { CompletionForm } from "@/services/medicalRecords";

import type { MasterlistRecordsState } from "../hooks/useMasterlistRecords";
import {
  LINKAGE_OPTIONS,
  SOURCE_OPTIONS,
  fromOption,
  serviceOptions,
  toOption,
  yearOf,
  yearOptions,
  yearRange,
} from "../masterlistFilters";
import type { Linkage, MasterlistSource } from "../types";

const CONTROL_HEIGHT = 44;
const WIDE_SEARCH = { flex: 2, minWidth: 220 } as const;
const WIDE_SELECT = { flex: 1, minWidth: 150 } as const;
const FULL_ROW = { width: "100%" } as const;
// Phones: two selects per row, so the list starts higher up the screen.
const PHONE_SELECT = { flexGrow: 1, minWidth: 140 } as const;
const YEARS = yearOptions();

type Props = { list: MasterlistRecordsState; forms: CompletionForm[]; phone?: boolean };

/** Search plus the four filters. Everything stays in memory, never in the URL. */
const MasterlistToolbar = ({ list, forms, phone = false }: Props) => {
  const { criteria, update } = list;
  const services = serviceOptions(forms.map((form) => ({ key: form.categoryKey, label: form.label })));
  const select = phone ? PHONE_SELECT : WIDE_SELECT;

  return (
    <View className={phone ? "flex-row flex-wrap gap-2.5" : "flex-row flex-wrap items-center gap-3"}>
      <SearchField
        value={criteria.search}
        onChangeText={(search) => update({ search, masterResidentId: "" })}
        placeholder="Search name, record or master ID"
        accessibilityLabel="Search medical records"
        style={phone ? FULL_ROW : WIDE_SEARCH}
      />
      {services.length > 2 ? (
        <SelectMenu
          label="Filter by service"
          value={toOption(criteria.serviceType)}
          options={services}
          onChange={(value) => update({ serviceType: fromOption(value) })}
          height={CONTROL_HEIGHT}
          style={select}
        />
      ) : null}
      <SelectMenu
        label="Filter by source"
        value={toOption(criteria.source)}
        options={SOURCE_OPTIONS}
        onChange={(value) => update({ source: fromOption(value) as MasterlistSource | "" })}
        height={CONTROL_HEIGHT}
        style={select}
      />
      <SelectMenu
        label="Filter by account status"
        value={toOption(criteria.linkage)}
        options={LINKAGE_OPTIONS}
        onChange={(value) => update({ linkage: fromOption(value) as Linkage | "" })}
        height={CONTROL_HEIGHT}
        style={select}
      />
      <SelectMenu
        label="Filter by visit year"
        value={yearOf(criteria)}
        options={YEARS}
        onChange={(value) => update(yearRange(value))}
        height={CONTROL_HEIGHT}
        style={select}
      />
    </View>
  );
};

export default MasterlistToolbar;
