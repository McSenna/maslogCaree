import { ScrollView, useWindowDimensions } from "react-native";
import { BREAKPOINTS } from "@/constants/breakpoints";
import { useOrganizations } from "@/hooks/useOrganizations";
import AboutHero from "../components/AboutHero";
import AboutSecurityNote from "../components/AboutSecurityNote";
import CommunitySection from "../components/CommunitySection";
import HealthcareTeamSection from "../components/HealthcareTeamSection";
import MissionSection from "../components/MissionSection";
import { HC } from "../constants/aboutTheme";

/**
 * About Barangay Maslog — the public page.
 *
 * Read-only and open to anyone: what the service is for, who the community is,
 * and who staffs the health team. The org chart is the only part that reads
 * from the API, so it carries its own loading and error states while the rest
 * of the page renders immediately.
 */
export default function AboutScreen() {
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
}
