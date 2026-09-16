import { useState } from "react";
import { useWindowDimensions } from "react-native";

import { BREAKPOINTS } from "@/constants/breakpoints";

import DesktopLanding from "./landing/DesktopLanding";
import MobileLanding from "./landing/MobileLanding";

const MaslogCareLandingScreen = () => {
  const { width } = useWindowDimensions();
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [isLearnMoreVisible, setIsLearnMoreVisible] = useState(false);

  const isDesktop = width >= BREAKPOINTS.desktop;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;

  const handleOpenRegister = () => setIsRegistrationVisible(true);
  const handleCloseRegister = () => setIsRegistrationVisible(false);

  const handleOpenLearnMore = () => setIsLearnMoreVisible(true);
  const handleCloseLearnMore = () => setIsLearnMoreVisible(false);

  const learnMore = {
    isLearnMoreVisible,
    onOpenLearnMore: handleOpenLearnMore,
    onCloseLearnMore: handleCloseLearnMore,
  };

  if (isDesktop || isTablet) {
    return (
      <DesktopLanding
        onOpenRegister={handleOpenRegister}
        isRegistrationVisible={isRegistrationVisible}
        onCloseRegister={handleCloseRegister}
        {...learnMore}
      />
    );
  }

  return (
    <MobileLanding
      onOpenRegister={handleOpenRegister}
      isRegistrationVisible={isRegistrationVisible}
      onCloseRegister={handleCloseRegister}
      {...learnMore}
    />
  );
};

export default MaslogCareLandingScreen;
