import { useWindowDimensions, View } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import DesktopResidentDashboard from "./DesktopResidentDashboard";
import MobileResidentDashboard from "./MobileResidentDashboard";
import { useResidentDashboard } from "./useResidentDashboard";

const ResidentDashboard = () => {
  const { width } = useWindowDimensions();
  const model = useResidentDashboard();

  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = !isMobile && width < 1200;

  return (
    <View className="flex-1 w-full min-w-0">
      {isMobile ? (
        <MobileResidentDashboard model={model} />
      ) : (
        <DesktopResidentDashboard model={model} compact={isTablet} />
      )}
    </View>
  );
};

export default ResidentDashboard;
