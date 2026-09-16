import { View } from "react-native";
import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { useUsersPalette } from "@/features/users/components/usersTheme";
import ResidentDetails from "../components/details/ResidentDetails";
import ResidentsDesktopLayout from "../components/ResidentsDesktopLayout";
import ResidentsEmptyState from "../components/ResidentsEmptyState";
import ResidentsMobileLayout from "../components/ResidentsMobileLayout";
import ResidentToolbar from "../components/ResidentToolbar";
import { useBhwResidentsScreen } from "../hooks/useBhwResidentsScreen";

const BhwResidentsScreen = () => {
  const palette = useUsersPalette();
  const controller = useBhwResidentsScreen();
  const { residents } = controller;

  const toolbar = <ResidentToolbar residents={residents} isDesktop={controller.showTable} />;
  const emptyState = (
    <ResidentsEmptyState
      error={residents.error}
      hasActiveFilters={residents.hasActiveFilters}
      onRetry={residents.retry}
    />
  );

  return (
    <View className="flex-1" onLayout={controller.measureContent}>
      <RoleScreenBackdrop color={palette.pageBg} insets={controller.insets} />

      {controller.showTable ? (
        <ResidentsDesktopLayout
          controller={controller}
          toolbar={toolbar}
          emptyState={emptyState}
        />
      ) : (
        <ResidentsMobileLayout
          controller={controller}
          toolbar={toolbar}
          emptyState={emptyState}
        />
      )}

      <ResidentDetails
        visible={controller.detailsResidentId !== null}
        resident={controller.detailsResident}
        loading={residents.loading}
        error={controller.detailsError}
        onRetry={residents.retry}
        onClose={controller.closeDetails}
      />
    </View>
  );
};

export default BhwResidentsScreen;
