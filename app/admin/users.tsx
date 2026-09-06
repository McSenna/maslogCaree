import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useUsers } from "@/hooks/useUsers";
import type { AdminUser } from "@/services/userService";
import { parseToDate } from "@/utils/dateFormatter";
import UserSearch from "@/components/users/UserSearch";
import UserFilters, { type RoleFilter } from "@/components/users/UserFilters";
import UsersTable, {
  type SortDir,
  type SortField,
} from "@/components/users/UsersTable";
import UserCard from "@/components/users/UserCard";
import UsersSkeletonList from "@/components/users/UsersSkeletonList";
import Screen from "@/components/layout/Screen";

const TABLE_BREAKPOINT = 768;

const GENDER_LABELS: Record<string, string> = {
  male: "male",
  female: "female",
  other: "other",
};

function searchMatches(user: AdminUser, query: string): boolean {
  const q = query.toLowerCase();
  return (
    user.fullname.toLowerCase().includes(q) ||
    (GENDER_LABELS[user.gender] ?? user.gender).toLowerCase().includes(q) ||
    user.address.toLowerCase().includes(q) ||
    user.role.toLowerCase().includes(q)
  );
}

function sortUsers(
  users: AdminUser[],
  field: SortField,
  dir: SortDir
): AdminUser[] {
  return [...users].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case "fullname":
        cmp = a.fullname.localeCompare(b.fullname);
        break;
      case "role":
        cmp = a.role.localeCompare(b.role);
        break;
      case "dateOfBirth":
        cmp =
          parseToDate(a.dateOfBirth).getTime() -
          parseToDate(b.dateOfBirth).getTime();
        break;
      case "createdAt":
        cmp =
          parseToDate(a.createdAt).getTime() -
          parseToDate(b.createdAt).getTime();
        break;
      case "updatedAt":
        cmp =
          parseToDate(a.updatedAt).getTime() -
          parseToDate(b.updatedAt).getTime();
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "items-center rounded-2xl border p-8 gap-4",
        classes.border,
        isDark ? "bg-slate-900/80" : "bg-white",
      ].join(" ")}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-rose-100">
        <Feather name="alert-circle" size={22} color="#f43f5e" />
      </View>
      <View className="items-center gap-1">
        <Text className={`text-sm font-semibold ${classes.textPrimary}`}>
          Unable to load users.
        </Text>
        <Text className={`text-center text-xs ${classes.textMuted}`}>
          Please check your connection and try again.
        </Text>
      </View>
      <Pressable
        onPress={onRetry}
        className="rounded-xl bg-mc-primary px-5 py-2.5"
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <Text className="text-sm font-semibold text-white">Retry</Text>
      </Pressable>
    </View>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View
      className={[
        "items-center rounded-2xl border p-8 gap-3",
        classes.border,
        isDark ? "bg-slate-900/80" : "bg-white",
      ].join(" ")}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Feather name="users" size={22} color="#94a3b8" />
      </View>
      <View className="items-center gap-1">
        <Text className={`text-sm font-semibold ${classes.textPrimary}`}>
          {hasFilters ? "No users match your search" : "No users found"}
        </Text>
        <Text className={`text-xs ${classes.textMuted}`}>
          {hasFilters
            ? "Try adjusting your search or filter."
            : "The database contains no registered users yet."}
        </Text>
      </View>
    </View>
  );
}


export default function AdminUsers() {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { width } = useWindowDimensions();
  const isDesktop = width >= TABLE_BREAKPOINT;

  const { users, loading, error, refreshing, fetchUsers, refreshUsers } =
    useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RoleFilter>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDir("asc");
      }
    },
    [sortField]
  );

  const filteredUsers = useMemo(() => {
    let result = users;

    if (activeFilter !== "all") {
      result = result.filter((u) => u.role === activeFilter);
    }

    if (searchQuery.trim()) {
      result = result.filter((u) => searchMatches(u, searchQuery.trim()));
    }

    return sortUsers(result, sortField, sortDir);
  }, [users, activeFilter, searchQuery, sortField, sortDir]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 || activeFilter !== "all";

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refreshUsers}
      tintColor={isDark ? "#38bdf8" : "#2A7DE1"}
      colors={["#2A7DE1"]}
    />
  );

  const ListHeader = (
    <View className="gap-5 pb-4">
      <View>
        <PageTitle>User Management</PageTitle>
        <PageSubtitle>
          {loading
            ? "Loading users…"
            : `${users.length} user${users.length !== 1 ? "s" : ""} in total`}
        </PageSubtitle>
      </View>

      <UserSearch value={searchQuery} onChangeText={setSearchQuery} />

      <UserFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {!loading && !error && (
        <View className="flex-row items-center justify-between gap-2">
          <Text className={`text-xs ${classes.textMuted}`}>
            Showing{" "}
            <Text className={`font-semibold ${classes.textSecondary}`}>
              {filteredUsers.length}
            </Text>{" "}
            {filteredUsers.length !== 1 ? "users" : "user"}
            {hasActiveFilters ? " (filtered)" : ""}
          </Text>
          {isDesktop && (
            <Text className={`text-[10px] ${classes.textMuted}`}>
              Sorted by {sortField} · {sortDir === "asc" ? "↑ ascending" : "↓ descending"}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <UsersSkeletonList count={6} isMobile={!isDesktop} />
      );
    }

    if (error) {
      return <ErrorState message={error} onRetry={fetchUsers} />;
    }

    if (filteredUsers.length === 0) {
      return <EmptyState hasFilters={hasActiveFilters} />;
    }

    if (isDesktop) {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: width - 48 }}>
            <UsersTable
              users={filteredUsers}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </View>
        </ScrollView>
      );
    }

    return null;
  };

  if (isDesktop || Platform.OS === "web") {
    return (
      <ScrollView
        className={`flex-1 ${classes.scrollBg}`}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <Screen className="py-5 md:py-8">
          <View className="gap-5">
            {ListHeader}
            {renderContent()}
          </View>
        </Screen>
      </ScrollView>
    );
  }

  // Mobile path: FlatList with UserCard items for pull-to-refresh + virtualization
  return (
    <FlatList
      className={`flex-1 ${classes.scrollBg}`}
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName="px-4 py-5 gap-3"
      data={loading || error ? [] : filteredUsers}
      keyExtractor={(item) => item._id}
      refreshControl={refreshControl}
      ListHeaderComponent={
        <View className="gap-5 pb-2">{ListHeader}</View>
      }
      ListEmptyComponent={
        loading ? (
          <UsersSkeletonList count={6} isMobile />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchUsers} />
        ) : (
          <EmptyState hasFilters={hasActiveFilters} />
        )
      }
      renderItem={({ item }) => <UserCard user={item} />}
      ItemSeparatorComponent={() => <View className="h-3" />}
      showsVerticalScrollIndicator={false}
    />
  );
}
