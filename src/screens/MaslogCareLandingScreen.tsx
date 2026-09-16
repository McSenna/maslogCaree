import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

import DesktopLanding from "./landing/DesktopLanding";
import MobileLanding from "./landing/MobileLanding";

const MaslogCareLandingScreen = () => {
  const { width } = useWindowDimensions();
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);

  const isDesktop = width >= BREAKPOINTS.desktop;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;

  const handleOpenRegister = () => setIsRegistrationVisible(true);
  const handleCloseRegister = () => setIsRegistrationVisible(false);

  if (isDesktop || isTablet) {
    return (
      <DesktopLanding
        isDesktop={isDesktop}
        onOpenRegister={handleOpenRegister}
        isRegistrationVisible={isRegistrationVisible}
        onCloseRegister={handleCloseRegister}
      />
    );
  }

  return (
    <MobileLanding
      onOpenRegister={handleOpenRegister}
      isRegistrationVisible={isRegistrationVisible}
      onCloseRegister={handleCloseRegister}
    />
  );
};

export default MaslogCareLandingScreen;
