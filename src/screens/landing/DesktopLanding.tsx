import { ScrollView, View } from "react-native";

import LandingBackground from "@/components/landing/LandingBackground";
import WaveDecoration from "@/components/landing/WaveDecoration";
import AuthCard from "@/features/auth/components/AuthCard";
import { AUTH_CARD_MAX_WIDTH } from "@/features/auth/components/authCardMetricPresets";
import RegistrationModal from "@/features/auth/components/RegistrationModal";
import AboutMaslogCareDialog from "@/components/about/AboutMaslogCareDialog";
import { useDesktopLandingLayout } from "@/hooks/useDesktopLandingLayout";

import DesktopHeroColumn from "./DesktopHeroColumn";
import { styles } from "./landingStyles";
import type { LandingScreenProps } from "./landingModalProps";

type Props = LandingScreenProps;

const COMPACT_CARD_DENSITY = 0.6;

const DesktopLanding = ({
  onOpenRegister,
  isRegistrationVisible,
  onCloseRegister,
  isLearnMoreVisible,
  onOpenLearnMore,
  onCloseLearnMore,
}: Props) => {
  const layout = useDesktopLandingLayout();

  const compactCard = layout.density < COMPACT_CARD_DENSITY;
  const cardWidth = compactCard ? AUTH_CARD_MAX_WIDTH.compact : AUTH_CARD_MAX_WIDTH.default;

  const content = (
    <View
      style={[
        styles.desktopContentContainer,
        {
          maxWidth: layout.page.contentMaxWidth,
          paddingHorizontal: layout.page.horizontalPadding,
          gap: layout.page.columnGap,
        },
      ]}
    >
      <DesktopHeroColumn
        layout={layout}
        onGetStarted={onOpenRegister}
        onLearnMore={onOpenLearnMore}
      />

      <View style={styles.desktopRightColumn}>
        <View style={[styles.desktopAuthAnchor, { width: cardWidth }]}>
          <AuthCard
            onOpenRegister={onOpenRegister}
            compact={compactCard}
            density={layout.density}
          />
        </View>
      </View>
    </View>
  );

  const framePadding = {
    paddingTop: layout.page.paddingTop,
    paddingBottom: layout.page.paddingBottom + layout.wave.clearance,
  };

  return (
    <View style={styles.desktopRoot}>
      <LandingBackground variant="desktop" />

      <WaveDecoration variant="desktop" height={layout.wave.height} />

      {layout.needsScrollFallback ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.desktopScrollContent, framePadding]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.desktopFrame, framePadding]}>{content}</View>
      )}

      <RegistrationModal visible={isRegistrationVisible} onClose={onCloseRegister} />

      <AboutMaslogCareDialog visible={isLearnMoreVisible} onClose={onCloseLearnMore} />
    </View>
  );
};

export default DesktopLanding;
