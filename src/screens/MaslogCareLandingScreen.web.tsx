import { useState } from "react";

import AboutMaslogCareDialog from "@/components/about/AboutMaslogCareDialog";
import RegistrationModal from "@/features/auth/components/RegistrationModal";
import WebLoginPage from "@/features/auth/webLogin/WebLoginPage";

// Web renders the login page with DOM form controls; native keeps MaslogCareLandingScreen.tsx.
const MaslogCareLandingScreen = () => {
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [isLearnMoreVisible, setIsLearnMoreVisible] = useState(false);

  return (
    <>
      <WebLoginPage
        onOpenRegister={() => setIsRegistrationVisible(true)}
        onOpenLearnMore={() => setIsLearnMoreVisible(true)}
      />
      <RegistrationModal
        visible={isRegistrationVisible}
        onClose={() => setIsRegistrationVisible(false)}
      />
      <AboutMaslogCareDialog
        visible={isLearnMoreVisible}
        onClose={() => setIsLearnMoreVisible(false)}
      />
    </>
  );
};

export default MaslogCareLandingScreen;
