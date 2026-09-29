import { useState } from "react";

import RegistrationModal from "@/features/auth/components/RegistrationModal";
import WebLoginPage from "@/features/auth/webLogin/WebLoginPage";

// Web renders the login page with DOM form controls; native keeps MaslogCareLandingScreen.tsx.
const MaslogCareLandingScreen = () => {
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);

  return (
    <>
      <WebLoginPage onOpenRegister={() => setIsRegistrationVisible(true)} />
      <RegistrationModal
        visible={isRegistrationVisible}
        onClose={() => setIsRegistrationVisible(false)}
      />
    </>
  );
};

export default MaslogCareLandingScreen;
