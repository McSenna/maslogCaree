import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";
import FeatureItem from "./FeatureItem";
import {
  AppointmentCalendarIcon,
  StethoscopeIcon,
  NotificationBellIcon,
} from "./FeatureIcons";

/**
 * Desktop-only left-side information section.
 *
 * Contains:
 * - Description paragraph (4 lines, comfortably constrained)
 * - Short blue accent line
 * - Three lightweight feature rows with custom vector icons
 */
interface DesktopInfoPanelProps {
  /** Reduced scale for compact desktops (e.g. 1366×768). */
  compact?: boolean;
}

export default function DesktopInfoPanel({
  compact = false,
}: DesktopInfoPanelProps) {
  const iconSize = compact ? 27 : 34;

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Description */}
      <Text style={[styles.description, compact && styles.descriptionCompact]}>
        MaslogCare is a barangay appointment{"\n"}
        and healthcare scheduling system designed{"\n"}
        to make services faster, easier, and more{"\n"}
        accessible for every resident.
      </Text>

      {/* Blue accent line */}
      <View style={[styles.accentLine, compact && styles.accentLineCompact]} />

      {/* Feature rows */}
      <View style={[styles.features, compact && styles.featuresCompact]}>
        <FeatureItem
          customIcon={
            <AppointmentCalendarIcon
              size={iconSize}
              color={LANDING_COLORS.primaryBlue}
            />
          }
          iconBgColor={LANDING_COLORS.softBlue}
          title="Book Appointments"
          description={"Schedule and manage your\nappointments with ease."}
          compact={compact}
        />

        <FeatureItem
          customIcon={
            <StethoscopeIcon
              size={iconSize}
              color={LANDING_COLORS.green}
            />
          }
          iconBgColor={LANDING_COLORS.softGreen}
          title="Access Health Services"
          description={"Connect with healthcare services\nin your barangay."}
          compact={compact}
        />

        <FeatureItem
          customIcon={
            <NotificationBellIcon
              size={iconSize}
              color={LANDING_COLORS.orange}
            />
          }
          iconBgColor={LANDING_COLORS.softOrange}
          title="Stay Updated"
          description={"Receive announcements and\nimportant reminders."}
          compact={compact}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 26,
    maxWidth: 680,
  },
  containerCompact: {
    gap: 20,
    maxWidth: 560,
  },
  description: {
    fontSize: 26,
    color: "#334155",
    lineHeight: 39,
    fontWeight: "400",
    letterSpacing: -0.2,
  },
  descriptionCompact: {
    fontSize: 20,
    lineHeight: 30,
  },
  accentLine: {
    width: 80,
    height: 5,
    backgroundColor: LANDING_COLORS.primaryBlue,
    borderRadius: 3,
  },
  accentLineCompact: {
    width: 64,
    height: 4,
  },
  features: {
    gap: 26,
    marginTop: 6,
  },
  featuresCompact: {
    gap: 17,
    marginTop: 2,
  },
});
