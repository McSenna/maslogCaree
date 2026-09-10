import type { ReactNode } from "react";
import { FlatList, Platform, RefreshControl, ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import { RADIUS } from "@/design/adminSurfaces";
import type { UserManagementController } from "../hooks/useUserManagementScreen";
import { PAGE_SIZE } from "../constants/usersLayout";
import UserMetricCards from "./UserMetricCards";
import UserMobileCard from "./UserMobileCard";
import UsersSkeletonList from "./UsersSkeletonList";
import { useUsersPalette } from "./usersTheme";

type UsersMobileLayoutProps = {
  controller: UserManagementController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

/** Phone: a card list with the metrics and toolbar riding above it. */
export default function UsersMobileLayout({
  controller,
  toolbar,
  emptyState,
}: UsersMobileLayoutProps) {
  const palette = useUsersPalette();
  const { filters, loading, error, dense } = controller;

  const refreshControl = (
    <RefreshControl
      refreshing={controller.refreshing}
      onRefresh={controller.refreshUsers}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const header = (
    <View className="w-full gap-4 pb-3">
      <UserMetricCards metrics={controller.metrics} isWide={false} />
      {toolbar}
    </View>
  );

  const footer =
    !loading && !error && filters.filteredUsers.length > 0 ? (
      <View className="w-full pt-4">
        <Pagination
          page={filters.page}
          totalPages={filters.totalPages}
          total={filters.filteredUsers.length}
          pageSize={PAGE_SIZE}
          isDesktop={false}
          onPageChange={filters.setPage}
        />
      </View>
    ) : null;

  const empty = loading ? (
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
      {emptyState}
    </View>
  );

  const listContentStyle = { ...controller.contentPadding, flexGrow: 1 };

  // react-native-web has no virtualization to gain here — the list is already
  // capped at one page — and a FlatList there interferes with page scrolling,
  // so the same cards render inside a ScrollView on web.
  if (Platform.OS === "web") {
    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listContentStyle}
        refreshControl={refreshControl}
      >
        {header}
        {filters.pageUsers.length === 0 ? (
          empty
        ) : (
          <View className="w-full gap-2.5">
            {filters.pageUsers.map((user) => (
              <UserMobileCard
                key={user._id}
                user={user}
                dense={dense}
                onPress={() => controller.openDetails(user._id)}
              />
            ))}
          </View>
        )}
        {footer}
      </ScrollView>
    );
  }

  return (
    <FlatList
      className="flex-1"
      data={loading || error ? [] : filters.pageUsers}
      keyExtractor={(item) => item._id}
      contentContainerStyle={listContentStyle}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={footer}
      ItemSeparatorComponent={() => <View className="h-2.5" />}
      renderItem={({ item }) => (
        <UserMobileCard
          user={item}
          dense={dense}
          onPress={() => controller.openDetails(item._id)}
        />
      )}
    />
  );
}
