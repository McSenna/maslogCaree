import { ScrollView, View } from "react-native";
import { useOrganizations } from "@/hooks/useOrganizations";
import AboutHero from "../components/AboutHero";
import AboutSecurityNote from "../components/AboutSecurityNote";
import LegalLinks from "@/features/legal/components/LegalLinks";
import CommunitySection from "../components/CommunitySection";
import HealthcareTeamSection from "../components/HealthcareTeamSection";
import MissionSection from "../components/MissionSection";
import { HC } from "../constants/aboutTheme";
import { usePageMaxWidth, useResponsive } from "@/hooks/useResponsive";

const AboutScreen = () => {
  const { isMobile, isDesktop } = useResponsive();
  const isTablet = !isMobile;
  const maxWidth = usePageMaxWidth("content");

  const { orgMembers, loading, error, retry } = useOrganizations();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: HC.white }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        width: "100%",
        maxWidth,
        alignSelf: "center",
        paddingHorizontal: isDesktop ? 16 : isTablet ? 12 : 0,
        paddingTop: 20,
        paddingBottom: 52,
        gap: 28,
      }}
    >
      <AboutHero isTablet={isTablet} />
      {isDesktop ? (
        // Two short text cards side by side keep each line a readable length.
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 20 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <MissionSection isTablet={isTablet} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <CommunitySection isTablet={isTablet} />
          </View>
        </View>
      ) : (
        <>
          <MissionSection isTablet={isTablet} />
          <CommunitySection isTablet={isTablet} />
        </>
      )}
      <HealthcareTeamSection
        members={orgMembers}
        loading={loading}
        error={error}
        onRetry={retry}
        isTablet={isTablet}
      />
      <AboutSecurityNote isTablet={isTablet} />
      <View style={{ paddingBottom: 12 }}>
        <LegalLinks />
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
