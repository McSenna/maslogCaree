import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import { CARD_SHADOW, RADIUS } from "@/design/adminSurfaces";
import type { UserManagementController } from "../hooks/useUserManagementScreen";
import { PAGE_SIZE } from "../constants/usersLayout";
import { TABLE_MIN_WIDTH } from "./usersTableColumns";
import { useUsersPalette } from "./usersTheme";
import UsersSkeletonList from "./UsersSkeletonList";
import UsersTable from "./UsersTable";

type UsersTableCardProps = {
  controller: UserManagementController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

const UsersTableCard = ({
  controller,
  toolbar,
  emptyState,
}: UsersTableCardProps) => {
  const palette = useUsersPalette();
  const { filters, loading, error } = controller;

  return (
    <View
      className="w-full overflow-hidden border"
      style={{
        borderRadius: RADIUS.card,
        backgroundColor: palette.cardBg,
        borderColor: palette.cardBorder,
        ...CARD_SHADOW,
      }}
    >
      <View
        className="w-full p-4"
        style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
      >
        {toolbar}
      </View>

      {loading ? (
        <UsersSkeletonList count={PAGE_SIZE} />
      ) : error || filters.pageUsers.length === 0 ? (
        emptyState
      ) : (
        <View
          className="w-full"
          onLayout={(event) => {
            const next = Math.round(event.nativeEvent.layout.width);
            if (next > 0 && next !== controller.tableAreaWidth) controller.setTableAreaWidth(next);
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ width: Math.max(controller.tableAreaWidth, TABLE_MIN_WIDTH) }}>
              <UsersTable
                users={filters.pageUsers}
                selectedUserId={controller.detailsUserId}
                onSelectUser={(user) => controller.openDetails(user._id)}
                checkedIds={controller.checkedIds}
                onToggleUser={controller.toggleUser}
                onToggleAll={controller.toggleAllOnPage}
              />
            </View>
          </ScrollView>
        </View>
      )}

      {!loading && !error && filters.filteredUsers.length > 0 ? (
        <View className="w-full p-4" style={{ borderTopWidth: 1, borderTopColor: palette.divider }}>
          <Pagination
            page={filters.page}
            totalPages={filters.totalPages}
            total={filters.filteredUsers.length}
            pageSize={PAGE_SIZE}
            isDesktop
            onPageChange={filters.setPage}
          />
        </View>
      ) : null}
    </View>
  );
};

export default UsersTableCard;
