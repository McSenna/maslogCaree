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
export default function DesktopInfoPanel() {
  return (
    <View style={styles.container}>
      {/* Description */}
      <Text style={styles.description}>
        MaslogCare is a barangay appointment{"\n"}
        and healthcare scheduling system designed{"\n"}
        to make services faster, easier, and more{"\n"}
        accessible for every resident.
      </Text>

      {/* Blue accent line */}
      <View style={styles.accentLine} />

      {/* Feature rows */}
      <View style={styles.features}>
        <FeatureItem
          customIcon={
            <AppointmentCalendarIcon
              size={30}
              color={LANDING_COLORS.primaryBlue}
            />
          }
          iconBgColor={LANDING_COLORS.softBlue}
          title="Book Appointments"
          description={"Schedule and manage your\nappointments with ease."}
        />

        <FeatureItem
          customIcon={
            <StethoscopeIcon
              size={30}
              color={LANDING_COLORS.green}
            />
          }
          iconBgColor={LANDING_COLORS.softGreen}
          title="Access Health Services"
          description={"Connect with healthcare services\nin your barangay."}
        />

        <FeatureItem
          customIcon={
            <NotificationBellIcon
              size={30}
              color={LANDING_COLORS.orange}
            />
          }
          iconBgColor={LANDING_COLORS.softOrange}
          title="Stay Updated"
          description={"Receive announcements and\nimportant reminders."}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    maxWidth: 560,
  },
  description: {
    fontSize: 21,
    color: "#334155",
    lineHeight: 32,
    fontWeight: "400",
    letterSpacing: -0.15,
  },
  accentLine: {
    width: 64,
    height: 4.5,
    backgroundColor: LANDING_COLORS.primaryBlue,
    borderRadius: 3,
  },
  features: {
    gap: 22,
    marginTop: 6,
  },
});
