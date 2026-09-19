import { View } from "react-native";

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
};

const HelpCenterContent = ({
  expandedCategoryId = null,
  onContactSupport,
  onViewRequests,
}: HelpCenterContentProps) => {
  const { search, contact, roleGuide } = useHelpCenterContent();

  return (
    <View style={{ gap: 20 }}>
      <HelpCenterHeader query={search.query} onQueryChange={search.setQuery} />

      {search.results.isSearching ? (
        <HelpSearchResults results={search.results} onContactSupport={onContactSupport} />
      ) : (
        <>
          <View>
            <HelpSectionHeading
              title="Browse help topics"
              description="Choose a topic to see step-by-step guidance for using MaslogCare."
            />
            <HelpCategoryGrid
              categories={HELP_CATEGORIES}
              expandedCategoryId={expandedCategoryId}
            />
          </View>

          {roleGuide ? <RoleGuideSection guide={roleGuide} /> : null}

          <PopularQuestions faqs={HELP_FAQS} />
        </>
      )}

      <SupportCTA onContactSupport={onContactSupport} onViewRequests={onViewRequests} />

      <ContactInformation contact={contact.contact} loading={contact.loading} />

      <EmergencyNotice />
    </View>
  );
};

export default HelpCenterContent;
