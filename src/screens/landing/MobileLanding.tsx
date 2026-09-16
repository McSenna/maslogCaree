import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import LandingBackground from "@/components/landing/LandingBackground";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import WaveDecoration from "@/components/landing/WaveDecoration";
import AuthCard from "@/features/auth/components/AuthCard";
import RegistrationModal from "@/features/auth/components/RegistrationModal";
import { useMobileLandingLayout } from "@/hooks/useMobileLandingLayout";

import { styles } from "./landingStyles";

type Props = {
  onOpenRegister: () => void;
  isRegistrationVisible: boolean;
  onCloseRegister: () => void;
};

const MobileLanding = ({
  onOpenRegister,
  isRegistrationVisible,
  onCloseRegister,
}: Props) => {
  const mobileLayout = useMobileLandingLayout();

  return (
    <View style={[styles.mobileRoot, { backgroundColor: "#F2F7FD" }]}>
      {Platform.OS !== "web" && <StatusBar style="dark" translucent />}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.mobileContent}
          scrollEnabled={!mobileLayout.fitsWithoutScrolling}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View
            style={[
              styles.mobileHeroSection,
              {
                minHeight: mobileLayout.hero.minHeight,
                paddingTop: mobileLayout.hero.paddingTop,
                paddingBottom: mobileLayout.hero.paddingBottom,
              },
            ]}
          >
            <LandingBackground variant="mobile" />

            <View style={styles.mobileBrandWrapper}>
              <MaslogCareBrand
                variant="mobile"
                logoSize={mobileLayout.brand.logoSize}
                titleFontSize={mobileLayout.brand.titleFontSize}
              />
            </View>

            <WaveDecoration variant="mobile" height={mobileLayout.hero.waveHeight} />
          </View>

          <View
            style={[
              styles.mobileCardWrapper,
              {
                marginHorizontal: mobileLayout.gutter,
                marginTop: -mobileLayout.card.overlap,
                paddingBottom: mobileLayout.bottomSpacing,
              },
            ]}
          >
            <AuthCard onOpenRegister={onOpenRegister} isMobile density={mobileLayout.density} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RegistrationModal visible={isRegistrationVisible} onClose={onCloseRegister} />
    </View>
  );
};

export default MobileLanding;
