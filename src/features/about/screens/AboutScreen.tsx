import { ScrollView } from "react-native";
import { useOrganizations } from "@/hooks/useOrganizations";
import AboutHero from "../components/AboutHero";
import AboutSecurityNote from "../components/AboutSecurityNote";
import CommunitySection from "../components/CommunitySection";
import HealthcareTeamSection from "../components/HealthcareTeamSection";
import MissionSection from "../components/MissionSection";
import { HC } from "../constants/aboutTheme";
import { useResponsive } from "@/hooks/useResponsive";

const AboutScreen = () => {
  const { isMobile, isDesktop } = useResponsive();
  const isTablet = !isMobile;

  const { orgMembers, loading, error, retry } = useOrganizations();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: HC.white }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: isDesktop ? 16 : isTablet ? 12 : 0,
        paddingTop: 20,
        paddingBottom: 52,
        gap: 28,
      }}
    >
      <AboutHero isTablet={isTablet} />
      <MissionSection isTablet={isTablet} />
      <CommunitySection isTablet={isTablet} />
      <HealthcareTeamSection
        members={orgMembers}
        loading={loading}
        error={error}
        onRetry={retry}
        isTablet={isTablet}
      />
      <AboutSecurityNote isTablet={isTablet} />
    </ScrollView>
  );
};

export default AboutScreen;
