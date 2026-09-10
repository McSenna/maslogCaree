import { View, useWindowDimensions } from "react-native";
import ScreenScroll from "@/components/layout/ScreenScroll";
import { BREAKPOINTS } from "@/constants/breakpoints";
import AnnouncementCard from "../components/AnnouncementCard";
import AnnouncementSectionLabel from "../components/AnnouncementSectionLabel";
import AnnouncementsFooterNote from "../components/AnnouncementsFooterNote";
import AnnouncementsHero from "../components/AnnouncementsHero";
import FeaturedAnnouncementCard from "../components/FeaturedAnnouncementCard";
import { ANNOUNCEMENTS } from "../data/announcements";

/**
 * Health Announcements — the public noticeboard.
 *
 * The soonest event is featured and the rest follow, which is why the list is
 * split rather than rendered uniformly: a resident opening this page is
 * usually looking for what is next.
 */
export default function AnnouncementsScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.desktop;

  const [featured, ...upcoming] = ANNOUNCEMENTS;

  return (
    <ScreenScroll>
      <View className="gap-6" style={{ paddingHorizontal: isDesktop ? 48 : 0 }}>
        <AnnouncementsHero eventCount={ANNOUNCEMENTS.length} isTablet={isTablet} />

        <View className="gap-2.5">
          <AnnouncementSectionLabel label="Next Event" accent="blue" isTablet={isTablet} />
          <FeaturedAnnouncementCard announcement={featured} isTablet={isTablet} />
        </View>

        <View className="gap-2.5">
          <AnnouncementSectionLabel label="More Upcoming" accent="slate" isTablet={isTablet} />

          {isDesktop ? (
            <View className="flex-row flex-wrap gap-3">
              {upcoming.map((announcement) => (
                <View key={announcement.title} style={{ width: "48%" }}>
                  <AnnouncementCard announcement={announcement} isTablet={isTablet} />
                </View>
              ))}
            </View>
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

        <AnnouncementsFooterNote isTablet={isTablet} />
      </View>
    </ScreenScroll>
  );
}
