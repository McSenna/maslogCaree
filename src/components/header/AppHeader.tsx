import { View, useWindowDimensions } from "react-native";
import { BREAKPOINTS, CONTENT_MAX_WIDTH } from "@/theme/breakpoints";
import { useTheme } from "@/contexts/ThemeContext";
import HeaderBrand from "./HeaderBrand";
import HeaderNotifications from "./HeaderNotifications";
import HeaderProfile from "./HeaderProfile";
import {
  getHeaderPalette,
  HEADER_HEIGHT,
  IDENTITY_MIN_WIDTH,
} from "./headerTokens";
import { HEADER_TOP_GAP, useHeaderTopInset } from "./useHeaderTopInset";
import { webStyle } from "@/theme/webStyle";
import MobileNotificationsLink from "./MobileNotificationsLink";

type AppHeaderProps = {
  onPressBrand?: () => void;
  variant: "mobile" | "desktop";
  mobileNotificationsHref?: string;
};

const AppHeader = ({ onPressBrand, variant, mobileNotificationsHref }: AppHeaderProps) => {
  const { width } = useWindowDimensions();
  const { resolvedTheme } = useTheme();

  const topInset = useHeaderTopInset();

  const isDark = resolvedTheme === "dark";
  const palette = getHeaderPalette(isDark);

  const isMobile = variant === "mobile";

  const widthKnown = width > 0;
  const isDesktop = !isMobile && (!widthKnown || width >= BREAKPOINTS.desktop);

  const showIdentity = !isMobile && (!widthKnown || width >= IDENTITY_MIN_WIDTH);

  const minHeight = isMobile ? undefined : HEADER_HEIGHT.desktop;
  const paddingHorizontal = isMobile ? 14 : isDesktop ? 32 : 24;

  return (
    <View
      style={[
        {
          width: "100%",
          zIndex: 40,
          backgroundColor: palette.background,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
          paddingTop: topInset + HEADER_TOP_GAP,
        },
        webStyle({ position: "sticky", top: 0 }),
      ]}
    >
      <View
        style={{
          minHeight,
          width: "100%",
          maxWidth: isMobile ? undefined : CONTENT_MAX_WIDTH,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal,
          paddingVertical: isMobile ? 10 : 8,
        }}
      >
        {isMobile ? (
          <HeaderBrand compact={isMobile} isDark={isDark} onPress={onPressBrand} />
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: isMobile ? 8 : 12,
            flexShrink: 0,
          }}
        >
          {!isMobile && <HeaderNotifications compact={isMobile} isDark={isDark} />}
          {isMobile && mobileNotificationsHref ? (
            <MobileNotificationsLink href={mobileNotificationsHref} isDark={isDark} />
          ) : null}

          {!isMobile && (
            <View
              style={{
                width: 1,
                height: 28,
                backgroundColor: palette.divider,
                marginHorizontal: 2,
              }}
            />
          )}

          <HeaderProfile
            compact={isMobile}
            isDark={isDark}
            showIdentity={showIdentity}
            showDetails={isDesktop}
          />
        </View>
      </View>
    </View>
  );
};

export default AppHeader;
