import { usePathname } from "expo-router";
import { View } from "react-native";

import { useHeaderTopInset } from "@/components/header/useHeaderTopInset";
import type { CurrentUser } from "@/contexts/AuthContext";

import AppStatusBar from "./AppStatusBar";
import HeaderActions from "./header/HeaderActions";
import HeaderBrand from "./header/HeaderBrand";
import HeaderNav from "./header/HeaderNav";
import { useResponsive } from "@/hooks/useResponsive";

type HeaderProps = {
  isMobile: boolean;
  onPressLogin: () => void;
  user?: CurrentUser | null;
};

const HEADER_SURFACE = "#3f54be";

const Header = ({ isMobile, onPressLogin, user }: HeaderProps) => {
  const pathname = usePathname();
  const { isDesktop } = useResponsive();
  const topInset = useHeaderTopInset();

  const logoSize = isMobile ? 35 : 40;

  return (
    <>
      <AppStatusBar style="light" backgroundColor={HEADER_SURFACE} />

      <View
        style={{
          zIndex: 50,
          backgroundColor: HEADER_SURFACE,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(12,31,110,0.35)",
          boxShadow: "0px 4px 12px rgba(12,31,110,0.2)",
          elevation: 8,
          paddingTop: topInset,
        }}
      >
        <View
          className="flex-row items-center justify-between"
          style={{
            paddingVertical: isMobile ? 10 : 12,
            paddingHorizontal: isDesktop ? 48 : isMobile ? 16 : 28,
          }}
        >
          <HeaderBrand isMobile={isMobile} logoSize={logoSize} />

          {!isMobile && <HeaderNav pathname={pathname} isDesktop={isDesktop} />}

          <HeaderActions isMobile={isMobile} user={user} onPressLogin={onPressLogin} />
        </View>
      </View>
    </>
  );
};

export default Header;
