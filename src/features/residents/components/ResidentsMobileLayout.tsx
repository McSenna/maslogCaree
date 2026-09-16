import type { ReactNode } from "react";
import { FlatList, Platform, RefreshControl, ScrollView, View } from "react-native";
import Pagination from "@/components/ui/Pagination";
import { RADIUS, useUsersPalette } from "@/features/users/components/usersTheme";
import type { BhwResidentsController } from "../hooks/useBhwResidentsScreen";
import ResidentCard from "./ResidentCard";
import ResidentSummaryCards from "./ResidentSummaryCards";
import ResidentsSkeletonList from "./ResidentsSkeletonList";

type ResidentsMobileLayoutProps = {
  controller: BhwResidentsController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

const ResidentsMobileLayout = ({
  controller,
  toolbar,
  emptyState,
}: ResidentsMobileLayoutProps) => {
  const palette = useUsersPalette();
  const { residents, dense } = controller;

  const refreshControl = (
    <RefreshControl
      refreshing={residents.refreshing}
      onRefresh={residents.refresh}
      tintColor={palette.primary}
      colors={[palette.primary]}
    />
  );

  const header = (
    <View className="w-full gap-4 pb-3">
      <ResidentSummaryCards summary={residents.summary} isWide={false} />
      {toolbar}
    </View>
  );

  const footer =
    !residents.loading && !residents.error && residents.total > 0 ? (
      <View className="w-full pt-4">
        <Pagination
          page={residents.page}
          totalPages={residents.totalPages}
          total={residents.total}
          pageSize={residents.pageSize}
          isDesktop={false}
          noun="residents"
          onPageChange={residents.setPage}
        />
      </View>
    ) : null;

  const empty = residents.loading ? (
    <ResidentsSkeletonList count={6} isMobile dense={dense} />
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
  const listOpacity = residents.busy && !residents.loading ? 0.55 : 1;

  if (Platform.OS === "web") {
    return (
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={listContentStyle}
        refreshControl={refreshControl}
      >
        {header}
        {residents.residents.length === 0 || residents.error ? (
          empty
        ) : (
          <View className="w-full gap-2.5" style={{ opacity: listOpacity }}>
            {residents.residents.map((resident) => (
              <ResidentCard
                key={resident._id}
                resident={resident}
                dense={dense}
                onPress={() => controller.openDetails(resident._id)}
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
      style={{ opacity: listOpacity }}
      data={residents.error ? [] : residents.residents}
      keyExtractor={(item) => item._id}
      contentContainerStyle={listContentStyle}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={footer}
      ItemSeparatorComponent={() => <View className="h-2.5" />}
      removeClippedSubviews
      initialNumToRender={8}
      windowSize={7}
      renderItem={({ item }) => (
        <ResidentCard
          resident={item}
          dense={dense}
          onPress={() => controller.openDetails(item._id)}
        />
      )}
    />
  );
};

export default ResidentsMobileLayout;
