import { Pressable, ScrollView, Text } from "react-native";
import type { AdminUser } from "@/services/userService";
import { useTheme } from "@/contexts/ThemeContext";

export type RoleFilter = AdminUser["role"] | "all";

type FilterOption = { value: RoleFilter; label: string };

const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "admin", label: "Admin" },
  { value: "doctor", label: "Doctor" },
  { value: "midwife", label: "Midwife" },
  { value: "bhw", label: "Barangay Health Worker" },
  { value: "resident", label: "Resident" },
];

type UserFiltersProps = {
  activeFilter: RoleFilter;
  onFilterChange: (filter: RoleFilter) => void;
};

export default function UserFilters({
  activeFilter,
  onFilterChange,
}: UserFiltersProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-0.5 py-0.5"
    >
      {FILTER_OPTIONS.map((opt) => {
        const isActive = activeFilter === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onFilterChange(opt.value)}
            className={[
              "rounded-full border px-3.5 py-1.5",
              isActive
                ? "border-mc-primary bg-mc-primary"
                : isDark
                  ? "border-slate-700 bg-slate-800/70"
                  : "border-slate-200 bg-white",
            ].join(" ")}
            style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
          >
            <Text
              className={[
                "text-xs font-semibold",
                isActive
                  ? "text-white"
                  : isDark
                    ? "text-slate-300"
                    : "text-slate-600",
              ].join(" ")}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
