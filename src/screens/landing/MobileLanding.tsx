import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import LandingBackground from "@/components/landing/LandingBackground";
import MaslogCareBrand from "@/components/landing/MaslogCareBrand";
import Reveal from "@/components/landing/motion/Reveal";
import { staggerDelay } from "@/components/landing/motion/landingMotion";
import WaveDecoration from "@/components/landing/WaveDecoration";
import AuthCard from "@/features/auth/components/AuthCard";
import RegistrationModal from "@/features/auth/components/RegistrationModal";
import LearnMoreDialog from "@/components/landing/learnMore/LearnMoreDialog";
import { useMobileLandingLayout } from "@/hooks/useMobileLandingLayout";

import { styles } from "./landingStyles";
import type { LandingScreenProps } from "./landingModalProps";

type Props = LandingScreenProps;

const MobileLanding = ({
  onOpenRegister,
  isRegistrationVisible,
  onCloseRegister,
  isLearnMoreVisible,
  onCloseLearnMore,
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

      <LearnMoreDialog visible={isLearnMoreVisible} onClose={onCloseLearnMore} />
    </View>
  );
};

export default MobileLanding;
