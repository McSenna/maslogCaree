import { useState } from "react";

import DesktopLanding from "./landing/DesktopLanding";
import MobileLanding from "./landing/MobileLanding";
import { useResponsive } from "@/hooks/useResponsive";

const MaslogCareLandingScreen = () => {
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [isLearnMoreVisible, setIsLearnMoreVisible] = useState(false);

  const { isDesktop, isTablet } = useResponsive();

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
    />
  );
};

export default MaslogCareLandingScreen;
