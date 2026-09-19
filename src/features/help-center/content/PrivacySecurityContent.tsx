import { View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import HelpArticleList from "../components/HelpArticleList";
import HelpSectionHeading from "../components/HelpSectionHeading";
import SupportCTA from "../components/SupportCTA";
import { HELP_CATEGORY_IDS, findHelpCategory } from "../constants/helpCategories.constants";

type PrivacySecurityContentProps = {
  onContactSupport: () => void;
  onViewRequests: () => void;
};

const PrivacySecurityContent = ({
  onContactSupport,
  onViewRequests,
}: PrivacySecurityContentProps) => {
  const palette = useAdminSurfacePalette();
  const category = findHelpCategory(HELP_CATEGORY_IDS.privacy);

  if (!category) return null;

  return (
    <View style={{ gap: 18 }}>
      <View>
        <HelpSectionHeading title={category.title} description={category.description} />

        <View
          style={{
            gap: 14,
            padding: 16,
            borderRadius: RADIUS.card,
            backgroundColor: palette.cardBg,
            borderWidth: 1,
            borderColor: palette.cardBorder,
          }}
        >
          <HelpArticleList articles={category.articles} />
        </View>
      </View>

      <SupportCTA onContactSupport={onContactSupport} onViewRequests={onViewRequests} />
    </View>
  );
};

export default PrivacySecurityContent;
