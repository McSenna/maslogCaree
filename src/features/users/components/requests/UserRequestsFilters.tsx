import { Text, View } from "react-native";
import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { CONTROL_HEIGHT, useUsersPalette } from "../usersTheme";
import type { RequestStatusFilter } from "../../hooks/useUserRequests";
import {
  ID_TYPE_FILTER_OPTIONS,
  REQUEST_DATE_OPTIONS,
  REQUEST_STATUS_OPTIONS,
  type RequestDatePreset,
} from "./userRequestsColumns";

type UserRequestsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: RequestStatusFilter;
  onStatusChange: (value: RequestStatusFilter) => void;
  showStatusFilter?: boolean;
  idType: string;
  onIdTypeChange: (value: string) => void;
  datePreset: RequestDatePreset;
  onDatePresetChange: (value: RequestDatePreset) => void;
  isDesktop: boolean;
  resultCount: number;
};

const UserRequestsFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  showStatusFilter = true,
  idType,
  onIdTypeChange,
  datePreset,
  onDatePresetChange,
  isDesktop,
  resultCount,
}: UserRequestsFiltersProps) => {
  const palette = useUsersPalette();

  const filters = (
    <>
      {showStatusFilter ? (
        <SelectMenu
          label="Filter by verification status"
          value={status}
          options={REQUEST_STATUS_OPTIONS}
          onChange={onStatusChange}
          icon="check-decagram-outline"
          height={CONTROL_HEIGHT}
          style={isDesktop ? { flex: 12, minWidth: 148 } : { flex: 1, minWidth: 130 }}
        />
      ) : null}

      <SelectMenu
        label="Filter by ID type"
        value={idType}
        options={ID_TYPE_FILTER_OPTIONS}
        onChange={onIdTypeChange}
        icon="card-account-details-outline"
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 16, minWidth: 170 } : { flex: 1, minWidth: 150 }}
      />

      <SelectMenu
        label="Filter by registration date"
        value={datePreset}
        options={REQUEST_DATE_OPTIONS}
        onChange={onDatePresetChange}
        icon="calendar-blank-outline"
        height={CONTROL_HEIGHT}
        style={isDesktop ? { flex: 12, minWidth: 148 } : { flex: 1, minWidth: 130 }}
      />
    </>
  );

  if (isDesktop) {
    return (
      <View className="w-full flex-row flex-wrap items-center gap-2.5">
        <SearchField
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search by name, email or contact number"
          accessibilityLabel="Search registration requests"
          style={{ flex: 26, minWidth: 240 }}
        />
        {filters}
      </View>
    );
  }

  return (
    <View className="w-full gap-2.5">
      <SearchField
        value={search}
        onChangeText={onSearchChange}
        placeholder="Search requests"
        accessibilityLabel="Search registration requests"
        style={{ flex: 1, minWidth: 0 }}
      />
      <View className="w-full flex-row flex-wrap gap-2.5">{filters}</View>
      <Text className="text-[12.5px]" style={{ color: palette.muted }}>
        {resultCount} {resultCount === 1 ? "request" : "requests"}
      </Text>
    </View>
  );
};

export default UserRequestsFilters;
