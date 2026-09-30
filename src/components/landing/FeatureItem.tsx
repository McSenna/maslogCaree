import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";

export type FeatureMetrics = {
  iconBox: number;
  titleSize: number;
  descriptionSize: number;
  rowPadding: number;
};

interface FeatureItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  customIcon?: React.ReactNode;
  iconColor?: string;
  iconBgColor: string;
  title: string;
  description: string;
  metrics: FeatureMetrics;
}

// Static information: no hover or press feedback, since nothing happens on click.
const FeatureItem = ({
  icon,
  customIcon,
  iconColor = LANDING_COLORS.primaryBlue,
  iconBgColor,
  title,
  description,
  metrics,
}: FeatureItemProps) => (
  <View
    accessible
    accessibilityRole="summary"
    accessibilityLabel={`${title}. ${description}`}
    style={[
      styles.row,
      {
        gap: Math.round(metrics.iconBox * 0.28),
        paddingVertical: metrics.rowPadding,
      },
    ]}
  >
    <View
      style={[
        styles.iconBox,
        {
          width: metrics.iconBox,
          height: metrics.iconBox,
          borderRadius: Math.round(metrics.iconBox * 0.31),
          backgroundColor: iconBgColor,
        },
      ]}
    >
      {customIcon ? customIcon : icon ? <Ionicons name={icon} size={28} color={iconColor} /> : null}
    </View>

    <View style={styles.textContainer}>
      <Text
        style={[
          styles.title,
          { fontSize: metrics.titleSize, lineHeight: Math.round(metrics.titleSize * 1.3) },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          {
            fontSize: metrics.descriptionSize,
            lineHeight: Math.round(metrics.descriptionSize * 1.45),
          },
        ]}
      >
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontWeight: "700",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.2,
  },
  description: {
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
  },
});

export default FeatureItem;
