import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import AppStatusBar from "@/components/layout/AppStatusBar";
import LandingBackground from "@/components/landing/LandingBackground";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import Reveal from "@/components/landing/motion/Reveal";
import { staggerDelay } from "@/components/landing/motion/landingMotion";
import WaveDecoration from "@/components/landing/WaveDecoration";
import AuthCard from "@/features/auth/components/AuthCard";
import RegistrationModal from "@/features/auth/components/RegistrationModal";
import { useMobileLandingLayout } from "@/hooks/useMobileLandingLayout";

import { styles } from "./landingStyles";
import type { RegistrationProps } from "./landingModalProps";

type Props = RegistrationProps;

const LANDING_SURFACE = "#F2F7FD";

const MobileLanding = ({
  onOpenRegister,
  isRegistrationVisible,
  onCloseRegister,
}: Props) => {
  const mobileLayout = useMobileLandingLayout();

  return (
    <View style={[styles.mobileRoot, { backgroundColor: LANDING_SURFACE }]}>
      {Platform.OS !== "web" && (
        <AppStatusBar style="dark" backgroundColor={LANDING_SURFACE} />
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.mobileContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
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
              <Reveal delay={0}>
                <MaslogCareBrand
                  variant="mobile"
                  logoSize={mobileLayout.brand.logoSize}
                  titleFontSize={mobileLayout.brand.titleFontSize}
                />
              </Reveal>
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
            <AuthCard
              onOpenRegister={onOpenRegister}
              isMobile
              density={mobileLayout.density}
              entranceDelay={staggerDelay(1)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RegistrationModal visible={isRegistrationVisible} onClose={onCloseRegister} />
    </View>
  );
};

export default MobileLanding;
