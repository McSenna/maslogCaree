import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import Button from "@/components/buttons/Button";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { DialogError } from "@/components/ui/dialog/DialogPieces";
import { Skeleton } from "@/components/ui/Skeleton";
import { useResidentDialogPalette, type ResidentDialogPalette } from "@/design/residentDialogTheme";
import { RADII } from "@/theme/radius";
import { friendlyErrorMessage } from "@/utils/friendlyError";

import type { AnnouncementRecord } from "../announcement.types";
import {
  formatAnnouncementLongDate,
  formatAnnouncementTime,
  formatPostedDate,
  isAnnouncementPast,
} from "../announcementFormat";
import type { AnnouncementDetailPreview } from "./announcementDetailStore";
import { useAnnouncementDetail } from "./useAnnouncementDetail";

type AnnouncementDetailDialogProps = {
  announcementId: string | null;
  preview: AnnouncementDetailPreview | null;
  onClose: () => void;
};

type Palette = ResidentDialogPalette;

const Title = ({ palette, children, past = false }: { palette: Palette; children: string; past?: boolean }) => (
  <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
    <Text
      accessibilityRole="header"
      selectable
      style={{ flex: 1, minWidth: 0, fontSize: 20, lineHeight: 26, fontWeight: "700", letterSpacing: -0.2, color: palette.heading }}
    >
      {children}
    </Text>
    {past ? (
      <View
        style={{
          marginTop: 3,
          paddingHorizontal: 9,
          paddingVertical: 3,
          borderRadius: RADII.pill,
          borderWidth: 1,
          borderColor: palette.border,
          backgroundColor: palette.card,
        }}
      >
        <Text style={{ fontSize: 11.5, fontWeight: "600", color: palette.muted }}>Past event</Text>
      </View>
    ) : null}
  </View>
);

const Fact = ({
  palette,
  icon,
  label,
  primary,
  secondary,
}: {
  palette: Palette;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  primary: string;
  secondary?: string;
}) => (
  <View
    accessible
    accessibilityLabel={`${label}: ${[primary, secondary].filter(Boolean).join(", ")}`}
    style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 12, paddingHorizontal: 14 }}
  >
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: palette.accentSoft,
      }}
    >
      <Feather name={icon} size={17} color={palette.accent} />
    </View>
    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: palette.muted }}>{label}</Text>
      <Text selectable style={{ fontSize: 15, lineHeight: 21, fontWeight: "600", color: palette.heading }}>
        {primary}
      </Text>
      {secondary ? <Text style={{ fontSize: 14, lineHeight: 20, color: palette.body }}>{secondary}</Text> : null}
    </View>
  </View>
);

const FactsPanel = ({ palette, children }: { palette: Palette; children: ReactNode }) => (
  <View
    style={{
      borderRadius: RADII.medium,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.card,
      overflow: "hidden",
    }}
  >
    {children}
  </View>
);

const Divider = ({ palette }: { palette: Palette }) => (
  <View style={{ height: 1, marginLeft: 62, backgroundColor: palette.border }} />
);

const Message = ({ palette, children }: { palette: Palette; children: string }) => (
  <Text selectable style={{ fontSize: 15, lineHeight: 23, color: palette.body }}>
    {children}
  </Text>
);

const Details = ({ palette, announcement }: { palette: Palette; announcement: AnnouncementRecord }) => {
  const date = formatAnnouncementLongDate(announcement.eventAt);
  const time = formatAnnouncementTime(announcement.eventAt);
  const posted = formatPostedDate(announcement.createdAt);

  return (
    <View style={{ gap: 18 }}>
      <Title palette={palette} past={isAnnouncementPast(announcement.eventAt)}>
        {announcement.title}
      </Title>

      <FactsPanel palette={palette}>
        <Fact
          palette={palette}
          icon="calendar"
          label="When"
          primary={date || "Date not available"}
          secondary={time || undefined}
        />
        <Divider palette={palette} />
        <Fact palette={palette} icon="map-pin" label="Where" primary={announcement.location || "Location not given"} />
      </FactsPanel>

      <Message palette={palette}>{announcement.message}</Message>

      {posted ? <Text style={{ fontSize: 12.5, color: palette.muted }}>{posted}</Text> : null}
    </View>
  );
};

const LoadingDetails = ({ palette, preview }: { palette: Palette; preview: AnnouncementDetailPreview | null }) => (
  <View accessibilityLabel="Loading announcement" style={{ gap: 18 }}>
    {preview?.title ? <Title palette={palette}>{preview.title}</Title> : <Skeleton style={{ height: 24, width: "60%" }} />}
    <FactsPanel palette={palette}>
      {[0, 1].map((row) => (
        <View key={row} style={{ flexDirection: "row", gap: 12, paddingVertical: 12, paddingHorizontal: 14 }}>
          <Skeleton style={{ width: 36, height: 36, borderRadius: 10 }} />
          <View style={{ flex: 1, gap: 6 }}>
            <Skeleton style={{ height: 11, width: 48 }} />
            <Skeleton style={{ height: 15, width: row === 0 ? "70%" : "55%" }} />
          </View>
        </View>
      ))}
    </FactsPanel>
    <View style={{ gap: 8 }}>
      <Skeleton style={{ height: 14, width: "96%" }} />
      <Skeleton style={{ height: 14, width: "88%" }} />
      <Skeleton style={{ height: 14, width: "62%" }} />
    </View>
  </View>
);

/** The notification's own words, for when the full post cannot be shown. */
const PreviewFallback = ({ palette, preview }: { palette: Palette; preview: AnnouncementDetailPreview }) => (
  <View style={{ gap: 12 }}>
    {preview.title ? <Title palette={palette}>{preview.title}</Title> : null}
    {preview.body ? <Message palette={palette}>{preview.body}</Message> : null}
  </View>
);

const UnavailableNote = ({ palette, hasPreview }: { palette: Palette; hasPreview: boolean }) => (
  <View
    accessibilityRole="alert"
    style={{
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 12,
      borderRadius: RADII.medium,
      borderWidth: 1,
      borderColor: palette.border,
      backgroundColor: palette.card,
    }}
  >
    <Feather name="info" size={16} color={palette.muted} style={{ marginTop: 1 }} />
    <Text style={{ flex: 1, minWidth: 0, fontSize: 13.5, lineHeight: 19, color: palette.body }}>
      {hasPreview
        ? "The full announcement is no longer available. Below is the notification you received."
        : "This announcement is no longer available. It may have been removed by the health center."}
    </Text>
  </View>
);

/**
 * Full what, when and where for one announcement, opened from a notification.
 * `ResponsiveDialog` makes it a centred modal from tablet width up and a bottom
 * sheet on phones, and owns focus, Escape, scroll lock and safe areas.
 */
const AnnouncementDetailDialog = ({ announcementId, preview, onClose }: AnnouncementDetailDialogProps) => {
  const palette = useResidentDialogPalette();
  const { state, retry } = useAnnouncementDetail(announcementId);

  return (
    <ResponsiveDialog
      visible
      title="Announcement"
      icon="volume-2"
      maxWidth={560}
      onClose={onClose}
      footer={<Button label="Close" variant="secondary" fullWidth onPress={onClose} />}
    >
      {state.status === "ready" ? (
        <Details palette={palette} announcement={state.announcement} />
      ) : state.status === "loading" ? (
        <LoadingDetails palette={palette} preview={preview} />
      ) : state.status === "error" ? (
        <View style={{ gap: 18 }}>
          <DialogError
            palette={palette}
            title="Couldn't load this announcement"
            message={friendlyErrorMessage(state.message)}
            actionLabel="Try again"
            onAction={retry}
          />
          {preview ? <PreviewFallback palette={palette} preview={preview} /> : null}
        </View>
      ) : (
        <View style={{ gap: 18 }}>
          <UnavailableNote palette={palette} hasPreview={Boolean(preview?.title || preview?.body)} />
          {preview ? <PreviewFallback palette={palette} preview={preview} /> : null}
        </View>
      )}
    </ResponsiveDialog>
  );
};

export default AnnouncementDetailDialog;
