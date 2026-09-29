import { View } from "react-native";
import ResponsiveGrid from "@/components/layout/ResponsiveGrid";
import ScreenScroll from "@/components/layout/ScreenScroll";
import AnnouncementCard from "../components/AnnouncementCard";
import AnnouncementSectionLabel from "../components/AnnouncementSectionLabel";
import { PublicFooter } from "../components/AnnouncementsFooterNote";
import AnnouncementsHero from "../components/AnnouncementsHero";
import FeaturedAnnouncementCard from "../components/FeaturedAnnouncementCard";
import { ANNOUNCEMENTS } from "../data/announcements";
import { usePageMaxWidth, useResponsive } from "@/hooks/useResponsive";

const AnnouncementsScreen = () => {
  const { isMobile, isDesktop } = useResponsive();
  const isTablet = !isMobile;
  const maxWidth = usePageMaxWidth("content");

  const [featured, ...upcoming] = ANNOUNCEMENTS;

  return (
    <ScreenScroll contentContainerStyle={{ width: "100%", maxWidth, alignSelf: "center" }}>
      <View className="gap-6" style={{ paddingHorizontal: isDesktop ? 48 : 0 }}>
        <AnnouncementsHero eventCount={ANNOUNCEMENTS.length} isTablet={isTablet} />

        <View className="gap-2.5">
          <AnnouncementSectionLabel label="Next Event" accent="blue" isTablet={isTablet} />
          <FeaturedAnnouncementCard announcement={featured} isTablet={isTablet} />
        </View>

        <View className="gap-2.5">
          <AnnouncementSectionLabel label="More Upcoming" accent="slate" isTablet={isTablet} />

          {isDesktop ? (
            <ResponsiveGrid minColumnWidth={300} maxColumns={3} gap={12} initialColumns={{ mobile: 1, desktop: 2, wide: 3 }}>
              {upcoming.map((announcement) => (
                <AnnouncementCard key={announcement.title} announcement={announcement} isTablet={isTablet} />
              ))}
            </ResponsiveGrid>
          ) : (
            <View className="gap-2.5">
              {upcoming.map((announcement) => (
                <AnnouncementCard
                  key={announcement.title}
                  announcement={announcement}
                  isTablet={isTablet}
                />
              ))}
            </View>
          )}
        </View>

        <PublicFooter isTablet={isTablet} />
      </View>
    </ScreenScroll>
  );
};

export default AnnouncementsScreen;
