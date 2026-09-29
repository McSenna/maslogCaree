import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useThemeColors } from "@/hooks/useThemeColors";
import { RADII } from "@/theme/radius";

import type { AnnouncementRecord } from "../../announcement.types";
import {
  formatAnnouncementDate,
  formatAnnouncementTime,
  formatPostedDate,
  isAnnouncementPast,
} from "../../announcementFormat";

type AnnouncementFeedCardProps = {
  announcement: AnnouncementRecord;
  /** Adds who posted it and how many accounts were notified. */
  showAdminMeta?: boolean;
};

const MetaRow = ({
  icon,
  label,
  children,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  children: string;
}) => {
  const colors = useThemeColors();

  return (
    <View accessibilityLabel={`${label}: ${children}`} style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
      <Feather name={icon} size={15} color={colors.primary} style={{ marginTop: 2 }} />
      <Text style={{ flex: 1, minWidth: 0, fontSize: 13.5, lineHeight: 19, fontWeight: "600", color: colors.heading }}>
        {children}
      </Text>
    </View>
  );
};

/** What, when and where for one announcement, with the date as a calendar tile. */
const AnnouncementFeedCard = ({ announcement, showAdminMeta = false }: AnnouncementFeedCardProps) => {
  const colors = useThemeColors();
  const eventDate = new Date(announcement.eventAt);
  const validDate = !Number.isNaN(eventDate.getTime());
  const past = isAnnouncementPast(announcement.eventAt);
  const when = [formatAnnouncementDate(announcement.eventAt), formatAnnouncementTime(announcement.eventAt)]
    .filter(Boolean)
    .join(" · ");

  const adminMeta = showAdminMeta
    ? [
        announcement.recipientCount !== undefined
          ? `Sent to ${announcement.recipientCount} ${announcement.recipientCount === 1 ? "account" : "accounts"}`
          : null,
        announcement.postedBy ? `by ${announcement.postedBy}` : null,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const footer = [formatPostedDate(announcement.createdAt), adminMeta].filter(Boolean).join(" · ");

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
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width: 52,
          alignSelf: "flex-start",
          alignItems: "center",
          paddingVertical: 8,
          borderRadius: RADII.medium,
          backgroundColor: past ? colors.surfaceMuted : colors.primarySoft,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.6,
            color: past ? colors.muted : colors.primary,
          }}
        >
          {validDate ? eventDate.toLocaleDateString(undefined, { month: "short" }).toUpperCase() : ""}
        </Text>
        <Text
          style={{
            fontSize: 22,
            lineHeight: 26,
            fontWeight: "700",
            fontVariant: ["tabular-nums"],
            color: past ? colors.muted : colors.heading,
          }}
        >
          {validDate ? eventDate.getDate() : ""}
        </Text>
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: 10 }}>
        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            <Text
              accessibilityRole="header"
              style={{ flex: 1, minWidth: 0, fontSize: 16, lineHeight: 22, fontWeight: "700", color: colors.heading }}
            >
              {announcement.title}
            </Text>
            {past ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: RADII.pill,
                  backgroundColor: colors.neutral.bg,
                  borderWidth: 1,
                  borderColor: colors.neutral.border,
                }}
              >
                <Text style={{ fontSize: 11.5, fontWeight: "600", color: colors.neutral.fg }}>Past</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ fontSize: 14, lineHeight: 21, color: colors.body }}>{announcement.message}</Text>
        </View>

        <View style={{ gap: 6 }}>
          {when ? (
            <MetaRow icon="clock" label="When">
              {when}
            </MetaRow>
          ) : null}
          <MetaRow icon="map-pin" label="Where">
            {announcement.location}
          </MetaRow>
        </View>

        {footer ? <Text style={{ fontSize: 12, color: colors.subtle }}>{footer}</Text> : null}
      </View>
    </View>
  );
};

export default AnnouncementFeedCard;
