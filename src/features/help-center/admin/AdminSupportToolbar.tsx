import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import SearchField from "@/components/ui/SearchField";
import SelectMenu from "@/components/ui/SelectMenu";
import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import {
  SUPPORT_CATEGORIES,
  SUPPORT_STATUS_LABELS,
  SUPPORT_STATUS_ORDER,
} from "../constants/support.constants";
import type { AdminTicketQuery } from "../services/adminSupportService";

type AdminSupportToolbarProps = {
  query: AdminTicketQuery;
  onChange: (patch: Partial<AdminTicketQuery>) => void;
  onClear?: () => void;
  hasActiveFilters?: boolean;
};

const statusOptions = [
  { value: "all", label: "All Statuses" },
  ...SUPPORT_STATUS_ORDER.map((status) => ({
    value: status,
    label: SUPPORT_STATUS_LABELS[status],
  })),
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  ...SUPPORT_CATEGORIES.map((entry) => ({
    value: entry.id,
    label: entry.label,
  })),
];

const sortOptions = [
  { value: "recent", label: "Recently Updated" },
  { value: "created", label: "Newest First" },
  { value: "oldest", label: "Oldest Activity" },
];

const AdminSupportToolbar = ({
  query,
  onChange,
  onClear,
  hasActiveFilters,
}: AdminSupportToolbarProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        width: "100%",
      }}
    >
      <SearchField
        value={query.search ?? ""}
        onChangeText={(search) => onChange({ search })}
        placeholder="Search by ticket ID, user, subject, or concern..."
        accessibilityLabel="Search support tickets"
        style={{ flex: 1, minWidth: 260 }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <SelectMenu
          label="Status"
          value={query.status ?? "all"}
          options={statusOptions}
          onChange={(status) => onChange({ status: status as AdminTicketQuery["status"] })}
          icon="filter-variant"
          style={{ minWidth: 160 }}
        />

        <SelectMenu
          label="Category"
          value={query.category ?? "all"}
          options={categoryOptions}
          onChange={(category) => onChange({ category: category as AdminTicketQuery["category"] })}
          icon="shape-outline"
          style={{ minWidth: 180 }}
        />

        <SelectMenu
          label="Sort"
          value={query.sort ?? "recent"}
          options={sortOptions}
          onChange={(sort) => onChange({ sort: sort as AdminTicketQuery["sort"] })}
          icon="sort"
          style={{ minWidth: 165 }}
        />

        {hasActiveFilters && onClear ? (
          <Pressable
            onPress={onClear}
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
            style={({ hovered, pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              height: 44,
              paddingHorizontal: 12,
              borderRadius: RADIUS.control,
              backgroundColor: hovered ? palette.subtleSurface : palette.cardBg,
              borderWidth: 1,
              borderColor: palette.cardBorder,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Feather name="x" size={14} color={palette.muted} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: palette.muted }}>
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default AdminSupportToolbar;
