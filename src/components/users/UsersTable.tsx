import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { AdminUser } from "@/services/userService";
import { useTheme } from "@/contexts/ThemeContext";
import UserTableRow from "./UserTableRow";

export type SortField =
  | "fullname"
  | "role"
  | "dateOfBirth"
  | "createdAt"
  | "updatedAt";

export type SortDir = "asc" | "desc";

// Column order that matches UserTableRow cell order:
// fullname | gender | address | role | dateOfBirth | createdAt | updatedAt
const HEADER_ORDER: Array<{
  key: SortField | null;
  label: string;
  flex: number;
}> = [
  { key: "fullname", label: "Full Name", flex: 3 },
  { key: null, label: "Gender", flex: 1.5 },
  { key: null, label: "Address", flex: 3 },
  { key: "role", label: "Role", flex: 2 },
  { key: "dateOfBirth", label: "Date of Birth", flex: 2 },
  { key: "createdAt", label: "Created At", flex: 2 },
  { key: "updatedAt", label: "Updated At", flex: 2 },
];

type UsersTableProps = {
  users: AdminUser[];
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
};

export default function UsersTable({
  users,
  sortField,
  sortDir,
  onSort,
}: UsersTableProps) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={`overflow-hidden rounded-2xl border ${classes.border}`}
    >
      {/* Header */}
      <View
        className={`flex-row border-b ${classes.border} ${
          isDark ? "bg-slate-800/90" : "bg-slate-50"
        }`}
      >
        {HEADER_ORDER.map((col, idx) => (
          <Pressable
            key={`${col.key ?? col.label}-${idx}`}
            style={{ flex: col.flex }}
            className="flex-row items-center gap-1 px-3 py-2.5"
            onPress={col.key ? () => onSort(col.key as SortField) : undefined}
            disabled={!col.key}
          >
            <Text
              className={`text-[10px] font-bold uppercase tracking-wide ${
                col.key && col.key === sortField
                  ? "text-mc-primary"
                  : classes.textMuted
              }`}
            >
              {col.label}
            </Text>
            {col.key && col.key === sortField && (
              <Feather
                name={sortDir === "asc" ? "chevron-up" : "chevron-down"}
                size={10}
                color="#2A7DE1"
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* Rows */}
      {users.map((user, idx) => (
        <UserTableRow key={user._id} user={user} isEven={idx % 2 === 0} />
      ))}
    </View>
  );
}
