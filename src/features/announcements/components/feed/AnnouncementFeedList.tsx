import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import AnimatedListItem from "@/components/animations/AnimatedListItem";
import Button from "@/components/buttons/Button";
import ResponsiveGrid from "@/components/layout/ResponsiveGrid";
import { EmptyState, ErrorState } from "@/components/feedback";
import type { FeedbackAction } from "@/components/feedback/FeedbackState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";
import { friendlyErrorMessage } from "@/utils/friendlyError";

import type { AnnouncementFeed } from "../../hooks/useAnnouncementFeed";
import AnnouncementFeedCard from "./AnnouncementFeedCard";

type AnnouncementFeedListProps = {
  feed: AnnouncementFeed;
  showAdminMeta?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: FeedbackAction;
};

const CARD_MIN_WIDTH = 440;

const CardSkeleton = () => {
  const colors = useThemeColors();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 14,
        padding: 16,
        borderRadius: RADII.large,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <Skeleton style={{ width: 52, height: 56 }} />
      <View style={{ flex: 1, gap: 10 }}>
        <Skeleton style={{ height: 18, width: "55%" }} />
        <Skeleton style={{ height: 14, width: "92%" }} />
        <Skeleton style={{ height: 14, width: "70%" }} />
        <Skeleton style={{ height: 14, width: "45%" }} />
      </View>
    </View>
  );
};

/** A refresh failed but older results are still on screen. */
export const StaleBanner = ({ message, onRetry, retrying }: { message: string; onRetry: () => void; retrying: boolean }) => {
  const colors = useThemeColors();

  return (
    <View
      accessibilityRole="alert"
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        padding: 12,
        borderRadius: RADII.medium,
        borderWidth: 1,
        borderColor: colors.warning.border,
        backgroundColor: colors.warning.bg,
      }}
    >
      <Feather name="alert-circle" size={16} color={colors.warning.fg} />
      <Text style={{ flex: 1, minWidth: 180, fontSize: 13, lineHeight: 18, color: colors.warning.fg }}>
        {friendlyErrorMessage(message)} Showing the last announcements loaded.
      </Text>
      <Button label="Retry" size="sm" variant="secondary" onPress={onRetry} loading={retrying} />
    </View>
  );
};

const AnnouncementFeedList = ({
  feed,
  showAdminMeta = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
}: AnnouncementFeedListProps) => {
  if (feed.loading && !feed.loaded) {
    return (
      <View accessibilityLabel="Loading announcements" style={{ gap: 12 }}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </View>
    );
  }

  if (feed.error && !feed.loaded) {
    return (
      <ErrorState
        title="Announcements are unavailable"
        message={feed.error}
        onRetry={feed.reload}
        retrying={feed.loading}
      />
    );
  }

  if (feed.announcements.length === 0) {
    return (
      <View style={{ gap: 12 }}>
        {feed.error ? <StaleBanner message={feed.error} onRetry={feed.refresh} retrying={feed.refreshing} /> : null}
        <EmptyState icon="volume-2" title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {feed.error ? <StaleBanner message={feed.error} onRetry={feed.refresh} retrying={feed.refreshing} /> : null}

      {/* Two-up once each card can keep a comfortable ~440px measure; one column below. */}
      <ResponsiveGrid minColumnWidth={CARD_MIN_WIDTH} maxColumns={2} gap={12} initialColumns={{ mobile: 1 }}>
        {feed.announcements.map((announcement, index) => (
          <AnimatedListItem key={announcement.id} index={index} style={{ height: "100%" }}>
            <AnnouncementFeedCard announcement={announcement} showAdminMeta={showAdminMeta} />
          </AnimatedListItem>
        ))}
      </ResponsiveGrid>

      {feed.hasMore ? (
        <View style={{ alignItems: "center", paddingTop: 4 }}>
          <Button
            label="Load older announcements"
            variant="secondary"
            onPress={() => void feed.loadMore()}
            loading={feed.loadingMore}
            loadingLabel="Loading…"
          />
        </View>
      ) : null}
    </View>
  );
};

export default AnnouncementFeedList;
