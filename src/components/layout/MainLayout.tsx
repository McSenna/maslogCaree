import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "./Header";
import BottomNav from "./BottomNav";
import LoginModal from "@/features/auth/components/LoginModal";
import RegistrationModal from "@/features/auth/components/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import { useBottomNavMetrics } from "@/components/navigation/bottomNav";
import { useAppForegroundLayout } from "@/hooks/useAppForegroundLayout";
import { useResponsive } from "@/hooks/useResponsive";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegistrationVisible, setIsRegistrationVisible] = useState(false);
  const [, setResumeTick] = useState(0);

  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useAppForegroundLayout(() => {
    setResumeTick((t) => t + 1);
  });

  const bottomNav = useBottomNavMetrics();

  const contentBottomPadding = isMobile
    ? bottomNav.contentPadding
    : insets.bottom;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["left", "right"]}>
      <View className="flex-1 bg-white" style={{ minHeight: 0 }}>
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