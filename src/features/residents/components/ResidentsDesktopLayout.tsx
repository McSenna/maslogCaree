import type { ReactNode } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useUsersPalette } from "@/features/users/components/usersTheme";
import type { BhwResidentsController } from "../hooks/useBhwResidentsScreen";
import ResidentSummaryCards from "./ResidentSummaryCards";
import ResidentsTableCard from "./ResidentsTableCard";

type ResidentsDesktopLayoutProps = {
  controller: BhwResidentsController;
  toolbar: ReactNode;
  emptyState: ReactNode;
};

const ResidentsDesktopLayout = ({
  controller,
  toolbar,
  emptyState,
}: ResidentsDesktopLayoutProps) => {
  const palette = useUsersPalette();

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={controller.contentPadding}
      refreshControl={
        <RefreshControl
          refreshing={controller.residents.refreshing}
          onRefresh={controller.residents.refresh}
          tintColor={palette.primary}
          colors={[palette.primary]}
        />
      }
    >
      <View className="w-full gap-5">
        <ResidentSummaryCards
          summary={controller.residents.summary}
          isWide={controller.wideSummary}
        />
        <ResidentsTableCard
          controller={controller}
          toolbar={toolbar}
          emptyState={emptyState}
        />
      </View>
    </ScrollView>
  );
};

export default ResidentsDesktopLayout;
