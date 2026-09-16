import { usePathname } from "expo-router";
import { StatusBar, View, useWindowDimensions } from "react-native";

import { useHeaderTopInset } from "@/components/header/useHeaderTopInset";
import { BREAKPOINTS } from "@/constants/breakpoints";
import type { CurrentUser } from "@/contexts/AuthContext";

import HeaderActions from "./header/HeaderActions";
import HeaderBrand from "./header/HeaderBrand";
import HeaderNav from "./header/HeaderNav";

type HeaderProps = {
  isMobile: boolean;
  onPressLogin: () => void;
  user?: CurrentUser | null;
};

const Header = ({ isMobile, onPressLogin, user }: HeaderProps) => {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const topInset = useHeaderTopInset();

  const isDesktop = width >= BREAKPOINTS.desktop;
  const logoSize = isMobile ? 35 : 40;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1e2a6e" />

      <View
        style={{
          zIndex: 50,
          backgroundColor: "#3f54be",
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
