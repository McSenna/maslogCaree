import { ScrollView, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useOrganizations } from "@/hooks/useOrganizations";
import AboutHero from "../components/AboutHero";
import AboutSecurityNote from "../components/AboutSecurityNote";
import CommunitySection from "../components/CommunitySection";
import HealthcareTeamSection from "../components/HealthcareTeamSection";
import MissionSection from "../components/MissionSection";
import { HC } from "../constants/aboutTheme";

const AboutScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const { orgMembers, loading, error } = useOrganizations();

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
        isTablet={isTablet}
      />
      <AboutSecurityNote isTablet={isTablet} />
    </ScrollView>
  );
};

export default AboutScreen;
