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
}: FeatureItemProps) {
  return (
    <View style={styles.row}>
      {/* Icon container */}
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
        {customIcon ? (
          customIcon
        ) : icon ? (
          <Ionicons name={icon} size={28} color={iconColor} />
        ) : null}
      </View>

      {/* Text column */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    paddingVertical: 2,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    gap: 4,
    paddingTop: 3,
  },
  title: {
    fontSize: 18.5,
    fontWeight: "700",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14.5,
    color: LANDING_COLORS.mutedText,
    lineHeight: 22,
    fontWeight: "400",
  },
});
