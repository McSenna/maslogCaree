import { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./Header";
import BottomNav from "./BottomNav";
import LoginModal from "../ui/LoginModal";
import RegistrationModal from "../ui/RegistrationModal";
import OtpVerificationModal from "../ui/OtpVerificationModal";
import { useAuth } from "../../contexts/AuthContext";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MOBILE_BOTTOM_NAV_RESERVED_PX = 70;

export default function MainLayout({ children }: MainLayoutProps) {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const contentBottomPadding = isMobile
    ? insets.bottom + MOBILE_BOTTOM_NAV_RESERVED_PX
    : insets.bottom;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-mc-background">
        <Header
          isMobile={isMobile}
          onPressLogin={() => setIsLoginModalVisible(true)}
          user={user}
        />

        <View
          className="flex-1 px-4 pt-6 md:px-10 md:pt-6"
          style={{ paddingBottom: contentBottomPadding, minHeight: 0 }}
        >
          {children}
        </View>

        {isMobile && <BottomNav />}

        <LoginModal
          visible={isLoginModalVisible}
          onClose={() => setIsLoginModalVisible(false)}
          onOpenRegister={() => setIsRegistrationVisible(true)}
        />

        <RegistrationModal
          visible={isRegistrationVisible}
          onClose={() => setIsRegistrationVisible(false)}
          onRegisteredEmail={(email) => {
            setRegistrationEmail(email);
            setIsRegistrationVisible(false);
            setIsOtpVisible(true);
          }}
        />

        <OtpVerificationModal
          visible={isOtpVisible}
          email={registrationEmail ?? ""}
          onClose={() => setIsOtpVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}