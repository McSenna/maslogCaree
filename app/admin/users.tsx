import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { ROLE_LAYOUT_PADDING } from "@/components/layout/RoleLayout";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Toast, { useToast } from "@/components/ui/Toast";
import {
  CARD_SHADOW,
  RADIUS,
  ROLE_FULL_LABELS,
  TABLE_MIN_WIDTH,
  UserDetails,
  UserMetricCards,
  UserMobileCard,
  UserSearchFilters,
  UsersPagination,
  UsersSkeletonList,
  UsersTable,
  computeUserMetrics,
  useUsersPalette,
  type RoleFilter,
  type SortKey,
  type StatusFilter,
} from "@/components/users";
import { useUsers } from "@/hooks/useUsers";
import {
  STATUS_ACTIONS,
  USER_STATUS_LABELS,
  updateUserStatus,
  type AdminUser,
} from "@/services/userService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";
import { parseToDate } from "@/utils/dateFormatter";

const PAGE_SIZE = 8;

/** Content-area widths, measured rather than taken from the window: the admin
 *  sidebar owns a fixed slice of the viewport, so the window width alone would
 *  put the table into a layout the page does not actually have room for. */
const LAYOUT = {
  /** Four metric cards across instead of a 2x2 grid. */
  fourMetrics: 1000,
  /** The table replaces the card list. */
  table: 820,
} as const;

/** Narrowest phones (320–360px) — trims the avatar and type, keeps the grid. */
const DENSE_WINDOW_WIDTH = 380;

function searchMatches(user: AdminUser, query: string): boolean {
  const q = query.toLowerCase();
  return (
    user.fullname.toLowerCase().includes(q) ||
    user.email.toLowerCase().includes(q) ||
    user.address.toLowerCase().includes(q) ||
    (ROLE_FULL_LABELS[user.role] ?? user.role).toLowerCase().includes(q)
  );
}

function sortUsers(users: AdminUser[], sort: SortKey): AdminUser[] {
  const byTime = (value: string | null | undefined) =>
    value ? parseToDate(value).getTime() : 0;

  return [...users].sort((a, b) => {
    switch (sort) {
      case "lastLogin_desc":
        return byTime(b.lastLogin) - byTime(a.lastLogin);
      case "lastLogin_asc":
        return byTime(a.lastLogin) - byTime(b.lastLogin);
      case "name_asc":
        return a.fullname.localeCompare(b.fullname);
      case "name_desc":
        return b.fullname.localeCompare(a.fullname);
      case "created_asc":
        return byTime(a.createdAt) - byTime(b.createdAt);
      case "created_desc":
      default:
        return byTime(b.createdAt) - byTime(a.createdAt);
    }
  });
}

function StateBlock({
  icon,
  tone,
  title,
  body,
  action,
}: {
  icon: keyof typeof Feather.glyphMap;
  tone: "neutral" | "error";
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
}) {
  const palette = useUsersPalette();
  const iconBg = tone === "error" ? "#FEE2E2" : palette.divider;
  const iconColor = tone === "error" ? "#EF4444" : palette.subtle;

  return (
    <View className="w-full items-center gap-3 px-6 py-14">
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Feather name={icon} size={20} color={iconColor} />
      </View>
      <View className="items-center gap-1">
        <Text className="text-[14px] font-semibold" style={{ color: palette.heading }}>
          {title}
        </Text>
        <Text className="text-center text-[12.5px]" style={{ color: palette.muted }}>
          {body}
        </Text>
      </View>
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          className="h-11 justify-center px-5"
          style={{ borderRadius: RADIUS.control, backgroundColor: palette.primary }}
        >
          <Text className="text-[14px] font-semibold text-white">{action.label}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function AdminUsers() {
  const palette = useUsersPalette();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  // Spacing this page wants from the edge of the content area, minus what the
  // shell already applies — mirrors the admin dashboard and System Logs so the
  // three pages line up under the header and against the sidebar.
  const isPhone = windowWidth < 768;
  const layoutPadding = isPhone ? ROLE_LAYOUT_PADDING.mobile : ROLE_LAYOUT_PADDING.desktop;
  const gutter = Math.max(0, (isPhone ? 16 : windowWidth >= 1024 ? 32 : 24) - layoutPadding.horizontal);
  const paddingTop = Math.max(0, (isPhone ? 16 : 24) - layoutPadding.top);
  const paddingBottom = Math.max(0, (isPhone ? 28 : 32) - layoutPadding.bottom);

  // Measured content width. Seeded from the window so the first paint is not a
  // phone layout on a desktop; replaced by the real figure on layout.
  const [contentWidth, setContentWidth] = useState(windowWidth);
  // The table's own box, measured separately: the card sits inside the page
  // gutter and its border, so deriving it from contentWidth would leave the
  // table a couple of pixels wide and scrolling when it should sit flush.
  const [tableAreaWidth, setTableAreaWidth] = useState(0);
  const showTable = contentWidth >= LAYOUT.table;
  const fourMetrics = contentWidth >= LAYOUT.fourMetrics;
  const dense = windowWidth < DENSE_WINDOW_WIDTH;

  const { users, loading, error, refreshing, fetchUsers, refreshUsers, applyUserUpdate } = useUsers();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("lastLogin_desc");
  const [page, setPage] = useState(1);

  const [checkedIds, setCheckedIds] = useState<ReadonlySet<string>>(new Set());
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);
  const [pendingStatusUser, setPendingStatusUser] = useState<AdminUser | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const metrics = useMemo(() => computeUserMetrics(users), [users]);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (role !== "all") result = result.filter((u) => u.role === role);
    if (status !== "all") result = result.filter((u) => u.status === status);
    const query = search.trim();
    if (query) result = result.filter((u) => searchMatches(u, query));
    return sortUsers(result, sort);
  }, [users, role, status, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  // Narrowing the results can leave the current page past the end of the list.
  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const pageUsers = useMemo(
    () => filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredUsers, page]
  );

  const hasActiveFilters = search.trim().length > 0 || role !== "all" || status !== "all";

  // Derived from the list rather than held as its own copy, so the dialog shows
  // the updated record immediately after a status change.
  const detailsUser = useMemo(
    () => users.find((u) => u._id === detailsUserId) ?? null,
    [users, detailsUserId]
  );

  // The dialog reads the record the table already holds, so there is no second
  // request to fail — the only way it can come up empty is the list failing to
  // load, or the account disappearing from a refresh while the dialog is open.
  const detailsError =
    detailsUserId !== null && !detailsUser && !loading
      ? error ?? "This account is no longer in the user list."
      : null;

  const handleViewActivity = useCallback(
    (user: AdminUser) => {
      // System Logs is the activity trail this app already keeps; sending the
      // admin there pre-filtered beats a second log viewer that would drift
      // from it. Email rather than name — it is the unique field the log search
      // matches on.
      setDetailsUserId(null);
      router.push({ pathname: "/admin/system-logs", params: { search: user.email } });
    },
    [router]
  );

  const resetToFirstPage = useCallback(() => setPage(1), []);

  const toggleUser = useCallback((userId: string, next: boolean) => {
    setCheckedIds((prev) => {
      const draft = new Set(prev);
      if (next) draft.add(userId);
      else draft.delete(userId);
      return draft;
    });
  }, []);

  const toggleAllOnPage = useCallback(
    (next: boolean) => {
      setCheckedIds((prev) => {
        const draft = new Set(prev);
        pageUsers.forEach((user) => (next ? draft.add(user._id) : draft.delete(user._id)));
        return draft;
      });
    },
    [pageUsers]
  );

  const confirmStatusChange = useCallback(async () => {
    if (!pendingStatusUser) return;

    const action = STATUS_ACTIONS[pendingStatusUser.status];
    setStatusSaving(true);
    try {
      const { user: updated, message } = await updateUserStatus(pendingStatusUser._id, action.next);
      applyUserUpdate(updated);
      setPendingStatusUser(null);
      showToast(message || `User ${USER_STATUS_LABELS[action.next].toLowerCase()}.`, "success");
    } catch (e: unknown) {
      // The dialog stays open on failure so the admin can retry without
      // hunting for the row again.
      showToast(getApiErrorMessage(e, "Unable to update this user. Please try again."), "error");
    } finally {
      setStatusSaving(false);
    }
  }, [pendingStatusUser, applyUserUpdate, showToast]);

  const handleAddUser = useCallback(() => {
    // No admin-side create endpoint exists yet; accounts are created through
    // the public registration + OTP flow. Say so rather than opening a form
    // that has nothing to submit to.
    showToast(
      "Creating a user from here isn't available yet — accounts are added through registration."
    );
  }, [showToast]);

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={refreshUsers}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const toolbar = (
    <UserSearchFilters
      search={search}
      onSearchChange={(value) => {
        setSearch(value);
        resetToFirstPage();
      }}
      role={role}
      onRoleChange={(value) => {
        setRole(value);
        resetToFirstPage();
      }}
      status={status}
      onStatusChange={(value) => {
        setStatus(value);
        resetToFirstPage();
      }}
      sort={sort}
      onSortChange={(value) => {
        setSort(value);
        resetToFirstPage();
      }}
      onAddUser={handleAddUser}
      isDesktop={showTable}
      resultCount={filteredUsers.length}
    />
  );

  const emptyOrError = error ? (
    <StateBlock
      icon="alert-circle"
      tone="error"
      title="Unable to load users."
      body={error}
      action={{ label: "Try again", onPress: fetchUsers }}
    />
  ) : (
    <StateBlock
      icon="users"
      tone="neutral"
      title={hasActiveFilters ? "No users match your search." : "No users found."}
      body={
        hasActiveFilters
          ? "Try adjusting your search or filters."
          : "The database contains no registered users yet."
      }
    />
  );

  /** Desktop: filters, table and pagination inside one white section. */
  const tableCard = (
    <View
      className="w-full overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View className="w-full p-4" style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}>
        {toolbar}
      </View>

      {loading ? (
        <UsersSkeletonList count={PAGE_SIZE} />
      ) : error || pageUsers.length === 0 ? (
        emptyOrError
      ) : (
        // Below TABLE_MIN_WIDTH the nine columns cramp, so the table keeps its
        // proportions and scrolls sideways instead of squeezing. At or above it
        // the table takes the full card width and the scroll never engages.
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== tableAreaWidth) setTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(tableAreaWidth, TABLE_MIN_WIDTH) }}>
              <UsersTable
                users={pageUsers}
                selectedUserId={detailsUserId}
                onSelectUser={(user) => setDetailsUserId(user._id)}
                checkedIds={checkedIds}
                onToggleUser={toggleUser}
                onToggleAll={toggleAllOnPage}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!loading && !error && filteredUsers.length > 0 ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <UsersPagination
            page={page}
            totalPages={totalPages}
            total={filteredUsers.length}
            pageSize={PAGE_SIZE}
            isDesktop
            onPageChange={setPage}
          />
        </View>
      ) : null}
    </View>
  );

  const mobileHeader = (
    <View className="w-full gap-4 pb-3">
      <UserMetricCards metrics={metrics} isWide={false} />
      {toolbar}
    </View>
  );

  const mobileFooter =
    !loading && !error && filteredUsers.length > 0 ? (
      <View className="w-full pt-4">
        <UsersPagination
          page={page}
          totalPages={totalPages}
          total={filteredUsers.length}
          pageSize={PAGE_SIZE}
          isDesktop={false}
          onPageChange={setPage}
        />
      </View>
    ) : null;

  const mobileEmpty = loading ? (
    <UsersSkeletonList count={6} isMobile dense={dense} />
  ) : (
    <View
      className="w-full border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
      }}
    >
      {emptyOrError}
    </View>
  );

  const overlays = (
    <>
      <UserDetails
        visible={detailsUserId !== null}
        user={detailsUser}
        loading={loading}
        error={detailsError}
        onRetry={fetchUsers}
        onClose={() => setDetailsUserId(null)}
        onChangeStatus={setPendingStatusUser}
        onViewActivity={handleViewActivity}
        busy={statusSaving}
      />
      <ConfirmationModal
        visible={pendingStatusUser !== null}
        // Named rather than "Deactivate User?": the dialog can be reached from
        // a row menu as well as from the details panel, and the admin has to be
        // able to check whose account this is without dismissing it first.
        title={
          pendingStatusUser
            ? `${STATUS_ACTIONS[pendingStatusUser.status].label.replace(/ (User|Account)$/, "")} ${pendingStatusUser.fullname}?`
            : ""
        }
        message={
          pendingStatusUser
            ? STATUS_ACTIONS[pendingStatusUser.status].destructive
              ? "This user will no longer be able to access their MaslogCare account until the account is reactivated."
              : `${pendingStatusUser.fullname} will be able to sign in to MaslogCare again.`
            : ""
        }
        confirmLabel={
          pendingStatusUser
            ? statusSaving
              ? STATUS_ACTIONS[pendingStatusUser.status].pendingLabel
              : STATUS_ACTIONS[pendingStatusUser.status].label
            : ""
        }
        destructive={pendingStatusUser ? STATUS_ACTIONS[pendingStatusUser.status].destructive : false}
        loading={statusSaving}
        onConfirm={confirmStatusChange}
        onCancel={() => setPendingStatusUser(null)}
      />
      <Toast toast={toast} onDismiss={hideToast} />
    </>
  );

  const pageTint = (
    // The page tint runs edge to edge behind the shell's padding, the same way
    // the admin dashboard paints it, so the sidebar and header meet this page
    // without a seam. Positioned rather than negatively margined so it cannot
    // feed back into the shell's flex row.
    <View
      style={{
        position: "absolute",
        top: -layoutPadding.top,
        bottom: -layoutPadding.bottom,
        left: -layoutPadding.horizontal,
        right: -layoutPadding.horizontal,
        backgroundColor: palette.pageBg,
      }}
    />
  );

  const onLayout = (event: { nativeEvent: { layout: { width: number } } }) => {
    const next = Math.round(event.nativeEvent.layout.width);
    if (next > 0 && next !== contentWidth) setContentWidth(next);
  };

  if (showTable) {
    return (
      <View className="flex-1" onLayout={onLayout}>
        {pageTint}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, paddingTop, paddingBottom }}
          refreshControl={refreshControl}
        >
          <View className="w-full gap-5">
            <UserMetricCards metrics={metrics} isWide={fourMetrics} />
            {tableCard}
          </View>
        </ScrollView>
        {overlays}
      </View>
    );
  }

  const listContentStyle = {
    paddingHorizontal: gutter,
    paddingTop,
    paddingBottom,
    flexGrow: 1,
  };

  // react-native-web has no virtualization to gain here — the list is already
  // capped at one page — and a FlatList there interferes with page scrolling,
  // so the same cards render inside a ScrollView on web.
  if (Platform.OS === "web") {
    return (
      <View className="flex-1" onLayout={onLayout}>
        {pageTint}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={listContentStyle}
          refreshControl={refreshControl}
        >
          {mobileHeader}
          {pageUsers.length === 0 ? (
            mobileEmpty
          ) : (
            <View className="w-full gap-2.5">
              {pageUsers.map((user) => (
                <UserMobileCard
                  key={user._id}
                  user={user}
                  dense={dense}
                  onPress={() => setDetailsUserId(user._id)}
                />
              ))}
            </View>
          )}
          {mobileFooter}
        </ScrollView>
        {overlays}
      </View>
    );
  }

  return (
    <View className="flex-1" onLayout={onLayout}>
      {pageTint}
      <FlatList
        className="flex-1"
        data={loading || error ? [] : pageUsers}
        keyExtractor={(item) => item._id}
        contentContainerStyle={listContentStyle}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={mobileHeader}
        ListEmptyComponent={mobileEmpty}
        ListFooterComponent={mobileFooter}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        renderItem={({ item }) => (
          <UserMobileCard
            user={item}
            dense={dense}
            onPress={() => setDetailsUserId(item._id)}
          />
        )}
      />
      {overlays}
    </View>
  );
}
