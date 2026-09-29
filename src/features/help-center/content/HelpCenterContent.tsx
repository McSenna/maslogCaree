import { View } from "react-native";

import { webStyle } from "@/theme/webStyle";

import ContactInformation from "../components/ContactInformation";
import EmergencyNotice from "../components/EmergencyNotice";
import HelpCategoryGrid from "../components/HelpCategoryGrid";
import HelpCenterHeader from "../components/HelpCenterHeader";
import HelpSearchResults from "../components/HelpSearchResults";
import HelpSectionHeading from "../components/HelpSectionHeading";
import PopularQuestions from "../components/PopularQuestions";
import RoleGuideSection from "../components/RoleGuideSection";
import SupportCTA from "../components/SupportCTA";
import { HELP_CATEGORIES } from "../constants/helpCategories.constants";
import { HELP_FAQS } from "../constants/helpFaqs.constants";
import { useHelpCenterContent } from "../hooks/useHelpCenterContent";

type HelpCenterContentProps = {
  expandedCategoryId?: string | null;
  onContactSupport: () => void;
  onViewRequests: () => void;
  /**
   * Put support, contact and emergency details in a column beside the topics.
   * For wide screens: guidance keeps a readable width and help stays in view.
   */
  sideRail?: boolean;
};

const SIDE_RAIL_WIDTH = 360;

const HelpCenterContent = ({
  expandedCategoryId = null,
  onContactSupport,
  onViewRequests,
  sideRail = false,
}: HelpCenterContentProps) => {
  const { search, contact, roleGuide } = useHelpCenterContent();

  const guidance = search.results.isSearching ? (
    <HelpSearchResults results={search.results} onContactSupport={onContactSupport} />
  ) : (
    <>
      <View>
        <HelpSectionHeading
          title="Browse help topics"
          description="Choose a topic to see step-by-step guidance for using MaslogCare."
        />
        <HelpCategoryGrid categories={HELP_CATEGORIES} expandedCategoryId={expandedCategoryId} />
      </View>

      {roleGuide ? <RoleGuideSection guide={roleGuide} /> : null}

      <PopularQuestions faqs={HELP_FAQS} />
    </>
  );

  const reachUs = (
    <>
      <SupportCTA onContactSupport={onContactSupport} onViewRequests={onViewRequests} />
      <ContactInformation contact={contact.contact} loading={contact.loading} />
      <EmergencyNotice />
    </>
  );

  return (
    <View style={{ gap: 20 }}>
      <HelpCenterHeader query={search.query} onQueryChange={search.setQuery} />

      {sideRail ? (
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 24 }}>
          <View style={{ flex: 1, minWidth: 0, gap: 20 }}>{guidance}</View>
          <View
            role="complementary"
            style={[{ width: SIDE_RAIL_WIDTH, gap: 20 }, webStyle({ position: "sticky", top: 0 })]}
          >
            {reachUs}
          </View>
        </View>
      ) : (
        <>
          {guidance}
          {reachUs}
        </>
      )}
    </View>
  );
};

export default HelpCenterContent;
