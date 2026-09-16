import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LandingBackground from "@/components/landing/LandingBackground";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import DesktopInfoPanel from "@/components/landing/DesktopInfoPanel";
import { desktopWaveHeight, default as WaveDecoration } from "@/components/landing/WaveDecoration";
import AuthCard from "@/features/auth/components/AuthCard";
import RegistrationModal from "@/features/auth/components/RegistrationModal";

import { styles } from "./landingStyles";

type Props = {
  isDesktop: boolean;
  onOpenRegister: () => void;
  isRegistrationVisible: boolean;
  onCloseRegister: () => void;
};

const DesktopLanding = ({
  isDesktop,
  onOpenRegister,
  isRegistrationVisible,
  onCloseRegister,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isCompactDesktop = !isDesktop || width < 1600 || height < 900;
  const waveHeight = desktopWaveHeight(isCompactDesktop);

  const contentMaxWidth = isDesktop ? 1640 : 960;
  const horizontalPadding = isDesktop
    ? width >= 1780
      ? 20
      : width >= 1400
      ? 48
      : 32
    : 20;

  return (
    <View style={styles.desktopRoot}>
      <LandingBackground variant="desktop" />

      <WaveDecoration variant="desktop" compact={isCompactDesktop} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.desktopScrollContent,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24) + waveHeight * 0.6,
            minHeight: height,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.desktopContentContainer,
            {
              maxWidth: contentMaxWidth,
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <View style={styles.desktopLeftColumn}>
            <MaslogCareBrand variant="desktop" compact={isCompactDesktop} />
            <DesktopInfoPanel compact={isCompactDesktop} />
          </View>

          <View style={styles.desktopRightColumn}>
            <AuthCard onOpenRegister={onOpenRegister} compact={isCompactDesktop} />
          </View>
        </View>
      </ScrollView>

      <RegistrationModal visible={isRegistrationVisible} onClose={onCloseRegister} />
    </View>
  );
};

export default DesktopLanding;
