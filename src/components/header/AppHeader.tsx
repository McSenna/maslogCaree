import { Platform, View, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
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

type AppHeaderProps = {
  /** Optional tap target on the branding (e.g. back to dashboard). */
  onPressBrand?: () => void;
};

/**
 * Application header.
 *
 * Desktop  →  [logo + tagline] ......... [bell | avatar  name / role  ▾]
 * Mobile   →  [logo + tagline] ......... [bell  avatar]
 */
const AppHeader = ({ onPressBrand }: AppHeaderProps) => {
  const { width } = useWindowDimensions();
  const { resolvedTheme } = useTheme();

  // The header owns the status-bar inset. RoleLayout deliberately does not wrap
  // it in a top-edge SafeAreaView, so this is applied exactly once.
  const topInset = useHeaderTopInset();

  const isDark = resolvedTheme === "dark";
  const palette = getHeaderPalette(isDark);

  const isMobile = width < BREAKPOINTS.tablet; // 0 – 767
  const isDesktop = width >= BREAKPOINTS.desktop; // 1024 +

  // Tablets show the name only when there is room for it; the role line and
  // chevron are reserved for desktop.
  const showIdentity = width >= IDENTITY_MIN_WIDTH;

  // Phones let the row size to the brand block plus its padding. A minimum
  // taller than the content is not padding — it is a floor, and `alignItems:
  // "center"` splits the surplus above and below, which is where the last of
  // the gap above the logo was coming from. Desktop keeps its roomier bar.
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
          // Padding sits inside the header's own background, so the status-bar
          // area is painted by the header rather than by the layout above it.
          paddingTop: topInset + HEADER_TOP_GAP,
        },
        Platform.OS === "web"
          ? ({ position: "sticky", top: 0 } as any)
          : null,
      ]}
    >
      <View
        style={{
          // minHeight rather than a fixed height: the row is only ever as tall
          // as the brand block plus its own padding, so it can never hold open
          // space its content does not need.
          minHeight,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal,
          paddingVertical: isMobile ? 10 : 8,
        }}
      >
        <HeaderBrand
          compact={isMobile}
          isDark={isDark}
          onPress={onPressBrand}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: isMobile ? 8 : 12,
            flexShrink: 0,
          }}
        >
          {/* Phones reach notifications from the bottom navigation instead, so
              the bell would be a second entry point crowding a small header.
              The web header keeps it — there is no bottom bar there. */}
          {!isMobile && <HeaderNotifications compact={isMobile} isDark={isDark} />}

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
