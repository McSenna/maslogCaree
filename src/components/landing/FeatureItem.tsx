import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";

interface FeatureItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  customIcon?: React.ReactNode;
  iconColor?: string;
  iconBgColor: string;
  title: string;
  description: string;
  /** Reduced scale for compact desktops. */
  compact?: boolean;
}

/**
 * Lightweight feature row used in the desktop information section.
 *
 * Structure: [ Rounded Icon Box ]  Title + Description
 *
 * Distinctively clean without outer borders or heavy cards.
 */
export default function FeatureItem({
  icon,
  customIcon,
  iconColor = LANDING_COLORS.primaryBlue,
  iconBgColor,
  title,
  description,
  compact = false,
}: FeatureItemProps) {
  return (
    <View style={[styles.row, compact && styles.rowCompact]}>
      {/* Icon container */}
      <View
        style={[
          styles.iconBox,
          compact && styles.iconBoxCompact,
          { backgroundColor: iconBgColor },
        ]}
      >
        {customIcon ? (
          customIcon
        ) : icon ? (
          <Ionicons name={icon} size={28} color={iconColor} />
        ) : null}
      </View>

      {/* Text column */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        <Text style={[styles.description, compact && styles.descriptionCompact]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 22,
    paddingVertical: 2,
  },
  rowCompact: {
    gap: 16,
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconBoxCompact: {
    width: 54,
    height: 54,
    borderRadius: 17,
  },
  textContainer: {
    flex: 1,
    gap: 5,
    paddingTop: 5,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.3,
  },
  titleCompact: {
    fontSize: 18.5,
  },
  description: {
    fontSize: 18,
    color: LANDING_COLORS.mutedText,
    lineHeight: 27,
    fontWeight: "400",
  },
  descriptionCompact: {
    fontSize: 14.5,
    lineHeight: 22,
  },
});
