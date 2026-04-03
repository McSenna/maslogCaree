import { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./Header";
import BottomNav from "./BottomNav";
import LoginModal from "../ui/LoginModal";
import RegistrationModal from "../ui/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useAppForegroundLayout } from "@/hooks/useAppForegroundLayout";

type MainLayoutProps = {
  children: React.ReactNode;
};

/** Space for fixed bottom pill (~56px) + gap; safe area is added separately via insets. */
const MOBILE_BOTTOM_NAV_RESERVED_PX = 68;
const MainLayout = ({ children }: MainLayoutProps) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [, setResumeTick] = useState(0);

  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINTS.tablet;
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useAppForegroundLayout(() => {
    setResumeTick((t) => t + 1);
  });

  const contentBottomPadding = isMobile
    ? insets.bottom + MOBILE_BOTTOM_NAV_RESERVED_PX
    : insets.bottom;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["left", "right"]}>
      <View className="flex-1 bg-mc-background" style={{ minHeight: 0 }}>
        <Header
          isMobile={isMobile}
          onPressLogin={() => setIsLoginModalVisible(true)}
          user={user}
        />

        <View
          className="flex-1 px-4 pt-6 md:px-10 md:pt-6"
          style={{
            paddingBottom: contentBottomPadding,
            minHeight: 0,
          }}
          collapsable={false}
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
        />
      </View>
    </SafeAreaView>
  );
};

export default MainLayout;